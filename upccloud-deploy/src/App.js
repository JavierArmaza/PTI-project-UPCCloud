import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { default as LandingPage } from './landing-page/LandingPage.tsx';
import { default as SignUp } from './sign-up/SignUp.tsx';
import { default as SignIn } from './sign-in/SignIn.tsx';
import { default as StoragePage } from './storage-page/StoragePage.tsx';
import { default as AboutUs } from './about-us/AboutUs.tsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/storage" element={<StoragePage />}></Route>
        <Route path="/about-us" element={<AboutUs />}></Route>
      </Routes>
    </Router>
  );
}