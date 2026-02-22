import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/onboarding/Welcome';
import SignUp from './pages/onboarding/SignUp';
import Login from './pages/onboarding/Login';
import ConnectPlatform from './pages/onboarding/ConnectPlatform';
import UploadChats from './pages/onboarding/UploadChats';
import SetRules from './pages/onboarding/SetRules';
import AhaPreview from './pages/onboarding/AhaPreview';
import Dashboard from './pages/dashboard/Dashboard';
import Activity from './pages/dashboard/Activity';
import Tasks from './pages/dashboard/Tasks';
import Memories from './pages/dashboard/Memories';
import Playground from './pages/dashboard/Playground';
import Settings from './pages/dashboard/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Root to Welcome */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />

        {/* Onboarding Flow */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/onboarding/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding/connect-platform" element={<ConnectPlatform />} />
        <Route path="/onboarding/upload-chats" element={<UploadChats />} />
        <Route path="/onboarding/set-rules" element={<SetRules />} />
        <Route path="/onboarding/aha-preview" element={<AhaPreview />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/activity" element={<Activity />} />
        <Route path="/dashboard/tasks" element={<Tasks />} />
        <Route path="/dashboard/memories" element={<Memories />} />
        <Route path="/dashboard/playground" element={<Playground />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;