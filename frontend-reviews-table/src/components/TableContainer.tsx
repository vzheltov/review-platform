import { useState, useEffect, useRef } from "react";
import { useReviewData } from "../hooks/useReviewData";
import { useZustand } from "../store/useZustand";
import { Header } from "./modules/Header";
import { SettingsPanel } from "./modules/SettingsPanel";
import { TableView } from "./modules/TableView";
import { PaginationBar } from "./modules/PaginationBar";
import { ReviewModal } from "../ui/ReviewModal";
import { remToPx } from "../utils/RemToPx";

const ROW_HEIGHT_REM = 6.25;

const TableContainer = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { dataSource, localReviews, fetchLocalData, setLimit, isInfinite } =
    useZustand();
  const reviewData = useReviewData();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableContainerRef.current) return;

    const calculateAutoLimit = (entries: ResizeObserverEntry[]) => {
      const rowHeightPx = remToPx(ROW_HEIGHT_REM);

      for (const entry of entries) {
        const containerHeight = entry.contentRect.height;
        let newLimit = Math.floor(containerHeight / rowHeightPx);
        if (newLimit < 3) newLimit = 3;

        setLimit(newLimit);
      }
    };

    const observer = new ResizeObserver((entries) => {
      const timer = setTimeout(() => calculateAutoLimit(entries), 150);
      return () => clearTimeout(timer);
    });

    observer.observe(tableContainerRef.current);
    return () => observer.disconnect();
  }, [setLimit]);

  useEffect(() => {
    if (dataSource === "zustand" && localReviews.length === 0) {
      fetchLocalData();
    }
  }, [dataSource, localReviews.length, fetchLocalData]);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 relative selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      <ReviewModal />
      <div className="w-full h-full mx-auto px-6 py-4 flex-1 flex flex-col relative z-10 justify-center">
        <Header
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />
        <div className="flex flex-row gap-4 shrink-0 justify-center items-start h-full max-h-[calc(100vh-120px)]">
          <div className="flex-1 flex flex-col relative z-10 min-w-0 h-full">
            <div className="h-full flex flex-col shrink-0 relative bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div
                ref={tableContainerRef}
                className="flex-1 overflow-hidden relative flex flex-col"
              >
                <TableView {...reviewData} />
              </div>
              {!isInfinite && !reviewData.isLoading && !reviewData.isError && (
                <PaginationBar totalPages={reviewData.totalPages} />
              )}
            </div>
          </div>
          <SettingsPanel isVisible={showSettings} />
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
