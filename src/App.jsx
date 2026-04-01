import { useState } from "react";
import { Menu } from "lucide-react";
import RenderFlowApp from "./RenderFlowApp.jsx";
import { LocaleProvider } from "./LocaleContext.jsx";
import DesignMindApp from "./DesignMindApp.jsx";
import PresentationPage from "./PresentationPage.jsx";

function pathMatchesPresentation(pathname) {
  if (!pathname) return false;
  return /\/presentation\/?$/.test(pathname);
}

function pathMatchesAppRoute(pathname) {
  if (!pathname) return false;
  return /\/app\/?$/.test(pathname);
}

/** 生产构建 + 部署在子路径（如 GitHub Pages）时，站点根路径直接展示演示页 */
function pathIsSiteRootForPresentation(pathname) {
  if (!pathname) return false;
  const base = import.meta.env.BASE_URL ?? "/";
  const normalized =
    base.endsWith("/") && base.length > 1 ? base.slice(0, -1) : base;
  if (normalized === "/" || normalized === "") {
    return pathname === "/" || pathname === "";
  }
  return pathname === normalized || pathname === `${normalized}/`;
}

export default function App() {
  const base = import.meta.env.BASE_URL ?? "/";
  const isSubpathDeploy =
    import.meta.env.PROD && base !== "/" && base !== "./";
  const baseWithSlash = base.endsWith("/") ? base : `${base}/`;

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isPresentationPage =
    typeof window !== "undefined" &&
    !pathMatchesAppRoute(pathname) &&
    (pathMatchesPresentation(pathname) ||
      (isSubpathDeploy && pathIsSiteRootForPresentation(pathname)));

  const handleStartAppFromPresentation = () => {
    if (isSubpathDeploy) {
      window.location.assign(`${baseWithSlash}app`);
    } else {
      window.location.assign("/");
    }
  };

  if (isPresentationPage) {
    return (
      <PresentationPage onStartApp={handleStartAppFromPresentation} />
    );
  }

  const [view, setView] = useState("renderflow");
  const [renderFlowStep, setRenderFlowStep] = useState(null);

  return (
    <div className="relative min-h-screen">
      {view === "renderflow" && (
        <>
          {renderFlowStep !== "studio" && (
            <button
              type="button"
              onClick={() => setView("designmind")}
              className="fixed top-4 left-4 z-[300] flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-3 py-2.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/55 sm:px-4"
              aria-expanded={false}
              aria-label="打开 DesignMind 排版"
            >
              <Menu className="h-5 w-5 shrink-0" />
              <span className="hidden text-[10px] font-black uppercase tracking-widest sm:inline">
                DesignMind
              </span>
            </button>
          )}
          <LocaleProvider>
            <RenderFlowApp onStepChange={setRenderFlowStep} />
          </LocaleProvider>
        </>
      )}

      {view === "designmind" && (
        <DesignMindApp onBackToRenderFlow={() => setView("renderflow")} />
      )}
    </div>
  );
}
