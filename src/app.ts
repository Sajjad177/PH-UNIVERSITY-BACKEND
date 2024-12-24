import cors from 'cors';
import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import router from './routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parser -->
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));


//corse setup :
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//routes
app.use('/api', router);

const test = async (req: Request, res: Response) => {
  const a = 1;
  const b = 2;
  const c = a + b;
  res.send(c);
};

app.get('/', test);

// app.get('/', (req: Request, res: Response) => {
//   res.send('This api is working');
// });

// global error handler :
app.use(globalErrorHandler as unknown as RequestHandler);
app.use(notFound as unknown as RequestHandler);

export default app;
