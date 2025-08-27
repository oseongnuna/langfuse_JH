// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";

// import Home from './pages/Home/Home';

import Tracing from "./Pages/Tracing/Tracing";
import Sessions from "./Pages/Tracing/Sessions/Sessions";
import SessionDetail from "./Pages/Tracing/Sessions/SessionDetail";

import Prompts from "./Pages/Prompts/Prompts";
import PromptsDetail from "./Pages/Prompts/PromptsDetail";
import PromptsNew from "./Pages/Prompts/PromptsNew";

// import Playground from './pages/Playground/Playground';

// import JudgePage from './pages/Evaluation/Judge/JudgePage';

import Dashboards from "./Pages/DashBoard/Dashboards";
import DashboardDetail from "./Pages/DashBoard/DashboardDetail";
import DashboardNew from "./Pages/DashBoard/DashboardNew.jsx";
// import WidgetNew from './pages/Dashboards/WidgetNew';

import SettingsPage from "./Pages/Settings/SettingsPage";
// import General from './pages/Settings/General';
// import ApiKeys from './pages/Settings/ApiKeys';
// import LLMConnections from "./pages/Settings/LLMConnections";
// import Models from './pages/Settings/Models';
// import Members from './pages/Settings/Members';
// import Scores from './pages/Settings/Scores';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 홈 -> /trace 경로로 리디렉션 */}
        <Route index element={<Navigate to="/trace" replace />} />

        {/* Tracing */}
        <Route path="trace" element={<Tracing />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="sessions/:sessionId" element={<SessionDetail />} />

        {/* Prompts */}
        <Route path="prompts" element={<Prompts />} />
        <Route path="prompts/:id" element={<PromptsDetail />} />
        <Route path="prompts/new" element={<PromptsNew />} />

        {/* <Route path="playground" element={<Playground />} /> */}

        {/* <Route path="llm-as-a-judge" element={<JudgePage />} /> */}

        {/* <Route path="evaluation" element={<Navigate to="/scores" replace />} />
        <Route path="evaluation/new" element={<Navigate to="/scores/new" replace />} />
        <Route path="evaluation/:id" element={<Navigate to="/scores/:id" replace />} />
        <Route path="evaluation/:id/edit" element={<Navigate to="/scores/:id/edit" replace />} /> */}

        <Route path="dashboards" element={<Dashboards />} />
        <Route path="dashboards/new" element={<DashboardNew />} />
        <Route path="dashboards/:dashboardId" element={<DashboardDetail />} />
        {/* <Route path="dashboards" element={<Dashboards />} />
        
        <Route path="dashboards/widgets/new" element={<WidgetNew />} />
         */}

        <Route path="settings" element={<SettingsPage />}>
          {/* <Route index element={<General/>}/>
          <Route path="llm-connections" element={<LLMConnections/>}/>
          <Route path="models" element={<Models/>}/>
          <Route path="scores" element={<Scores/>}/>
          <Route path="members" element={<Members/>}/> */}
        </Route>
      </Route>
    </Routes>
  );
}
