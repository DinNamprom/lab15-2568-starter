import { Router,type Request, type Response } from "express";
import { students,courses } from "../db/db.js";
import { zStudentPostBody} from "../schemas/studentValidator.js";

const router = Router();

router.get("/:studentId/courses",(req:Request, res:Response) => {
        const { studentId } = req.params;  
        const val_result = zStudentPostBody.shape.studentId.safeParse(studentId);
        if (!val_result.success) {
          return res.status(400).json({
            message: "Validation failed",
            errors : val_result.error.issues[0]?.message
          });
        }
    
        const student = students.find((s) => s.studentId === studentId);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student does not exists",
          });
        }
    
        const studentCourseIds = student.courses ?? [];
        const resultCourses = studentCourseIds
          .map((id) => {
            const c = courses.find((x) => x.courseId === id);
            return c ? { courseId: c.courseId, courseTitle: c.courseTitle } : null;
          })
          .filter((x): x is { courseId: number; courseTitle: string } => x !== null);
    
        return res.json({
          success: true,
          message: `Get courses detail of student ${studentId}`,
          data: {
            studentId,
            courses: resultCourses,
          },
        });
});

export default router;
