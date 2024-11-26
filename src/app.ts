import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRoutes } from './modules/students/students.route';
import { UserRoutes } from './modules/user/user.router';
const app: Application = express();

// parser -->
app.use(express.json());

//corse setup :
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//routes
app.use('/api/students', StudentRoutes);
app.use('/api/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('This api is working');
});

export default app;
