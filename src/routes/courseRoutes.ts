import { Router,type Request, type Response } from "express";
import { courses } from "../db/db.js";
import { zCoursePostBody, zCourseDeleteBody, zCoursePutBody } from "../schemas/courseValidator.js";
const router: Router = Router();

// READ all
router.get("/", (req:Request, res:Response) => {
    return res.json({courses});
});

// Params URL 
router.get("/:courseId", (req:Request, res:Response) => {
    const {courseId} = req.params
    const id = Number(courseId)
    if (!Number.isInteger(id) || Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid input: expected number, received NaN"
        });
    }
    const val_result = zCoursePostBody.shape.courseId.safeParse(id);
    if (!val_result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: val_result.error.issues[0]?.message
        });
    }
    
    const course = courses.find((c) => c.courseId === id);
    if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course does not exists"
        });
    }
    
    return res.json({
        success: true,
        message: `Get courses ${courseId} succesfully`,
        data: {
          courseId : course.courseId,
          courseTitle: course.courseTitle,
          instructors: course.instructors
    }
    });
});

router.post("/", async (req:Request, res:Response) => {
    const body = await req.body;
    const val_result = zCoursePostBody.safeParse(body);
    if (!val_result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: val_result.error.issues[0]?.message
        });
    }
    const dupe = courses.find((c) => c.courseId === body.courseId);
    if (dupe) {
        return res.status(409).json({
          success: false,
          message: "Course Id already exists"
        });
    }
    courses.push(body);
    return res.json({
        success: true,
        message: `Coures ${body.courseId} has been added successfully`,
        data: {body}
      });
});

router.put("/", (req:Request, res:Response) => {
    const body = req.body;
    const val_result = zCoursePutBody.safeParse(body);
    if (!val_result.success) {
        return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: val_result.error.issues[0]?.message
        })
    }

    const course = courses.find((c) => c.courseId === body.courseId);
    if (!course) {
        return res.status(404).json({
        success: false,
        message: "Course Id does not exists"
        });
    }

    course.courseTitle = body.courseTitle;
    course.instructors = body.instructors;
    return res.json({
        success: true,
        message: `course ${course} has been updated successfully`,
        body: {
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        instructors: course.instructors
        }
    })
});

router.delete("/",(req:Request, res:Response) => {
    const body = req.body;
    const id = Number(body.courseId);
    if (!Number.isInteger(id) || Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid input: expected number, received NaN"
        });
    }

    const val_result = zCourseDeleteBody.shape.courseId.safeParse(id);
    if (!val_result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: val_result.error.issues[0]?.message
        });
    }

    const course = courses.find((c) => c.courseId === id);
    if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course does not exists"
        });
    }

    for (let i=0;i<courses.length;i++) {
        if(courses[i]?.courseId === course.courseId) {
            courses.splice(i-1,1);
        }
    }
    return res.json({
        success:true,
        message: `Course ${course.courseId} has been deleted successfully`,
        data: {course}
    });
});

export default router;
