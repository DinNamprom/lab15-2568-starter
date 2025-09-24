import express from "express";
import morgan from 'morgan';
import type { Request, Response } from "express";
//import { success } from "zod";
import coursesRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js"

const app: any = express();
//Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use("/api/v2/courses", coursesRoutes);
app.use("/api/v2/students", studentRoutes)

app.get('/', (req:Request, res:Response) => {
  res.send('Hello');
});

app.get('/me', (req:Request, res:Response) => {
  res.json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "670610676",
      firstName: "komneth",
      lastName: "namprom",
      program: "CPE",
      section: "001"
    }
  })
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
