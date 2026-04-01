import { useState } from "react";
import { Menu } from "lucide-react";
import RenderFlowApp from "./RenderFlowApp.jsx";
import { LocaleProvider } from "./LocaleContext.jsx";
import DesignMindApp from "./DesignMindApp.jsx";
import PresentationPage from "./PresentationPage.jsx";

function normalizePath(pathname) {
  if (!pathname) return "/";
  const t = pathname.replace(/\/+$/, "");
  return t === "" ? "/" : t;
}

function pathMatchesPresentation(pathname) {
  if (!pathname) return false;
  return /\/presentation\/?$/.test(pathname);
}

function pathMatchesAppRoute(pathname) {
  if (!pathname) return false;
  return /\/app\/?$/.test(pathname);
}

/** 生产 + 子路径部署时：当前路径即站点根（与 BASE_URL 同目录）→ 演示页 */
function pathIsSiteRootForPresentation(pathname) {
  const baseRaw = import.meta.env.BASE_URL ?? "/";
  if (baseRaw === "./") {
    return normalizePath(pathname) === "/";
  }
  const baseNorm = normalizePath(baseRaw);
  const pathNorm = normalizePath(pathname);
  return pathNorm === baseNorm;
}

export default function App() {
  const [view, setView] = useState("renderflow");
  const [renderFlowStep, setRenderFlowStep] = useState(null);

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
