import express, { Application } from 'express';
import cors from 'cors';
import otpRoutes from './routes/otp.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/otp', otpRoutes);

app.get('/', (req, res) => {
  res.send('OK');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err);
    process.exit(1);
  }
  console.log(`==================================================`);
  console.log(`Server is waiting for OTP requests on port ${PORT}...`);
  console.log(`==================================================`);
});
