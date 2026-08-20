"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isPdfUrl } from "@/lib/utils";
import {
  FileText,
  ExternalLink,
  X,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Globe,
} from "lucide-react";

export interface InlinePdfViewerProps {
  url: string;
  title?: string;
  organizationName?: string;
  onClose: () => void;
}

export function InlinePdfViewer({
  url,
  title = "Official Notification Gazette (PDF)",
  organizationName = "Government Authority",
  onClose,
}: InlinePdfViewerProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [isWebPageNotice, setIsWebPageNotice] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [retryCount, setRetryCount] = React.useState(0);

  // Extract hostname for user transparency
  const getDomainName = (rawUrl: string) => {
    try {
      return new URL(rawUrl).hostname.replace(/^www\./, "");
    } catch {
      return "Official Portal";
    }
  };

  const domain = getDomainName(url);
  const isDirectPdf = isPdfUrl(url);
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}&r=${retryCount}`;

  // Reset & verify PDF streaming whenever URL or retryCount changes
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsWebPageNotice(false);
    setErrorMessage("");

    if (!isDirectPdf) {
      setIsLoading(false);
      setIsWebPageNotice(true);
      return;
    }

    // Verify proxy response in parallel
    const controller = new AbortController();
    fetch(proxyUrl, { method: "GET", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setHasError(true);
          if (json.isWebPage) {
            setIsWebPageNotice(true);
            setErrorMessage("The official source provides a web notification page rather than a standalone PDF.");
          } else if (res.status === 404) {
            setErrorMessage(`The official PDF document was not found at ${domain} (HTTP 404).`);
          } else {
            setErrorMessage(json.error || `Official server returned status ${res.status}.`);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // If fetch fails, allow iframe to attempt native browser load or set fallback
          setTimeout(() => setIsLoading(false), 2000);
        }
      });

    return () => controller.abort();
  }, [url, retryCount, isDirectPdf, domain, proxyUrl]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="w-full mt-6 rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* Viewer Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400 shrink-0">
            {isWebPageNotice ? <Globe className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white truncate max-w-xs sm:max-w-md">
                {title}
              </span>
              <Badge
                variant="success"
                className="hidden sm:inline-flex text-[10px] font-semibold bg-emerald-950 text-emerald-300 border-emerald-800"
              >
                <ShieldCheck className="h-3 w-3 mr-1" />
                Official Source
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Source: <span className="text-slate-300 font-medium">{domain}</span> ({organizationName})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Direct Link to Official Website in New Tab */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open official notice at ${domain}`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline">Open Official Portal</span>
              <span className="md:hidden">Portal</span>
            </Button>
          </a>

          {/* Close Viewer Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border-red-900/60 bg-red-950/20"
          >
            <X className="h-3.5 w-3.5" />
            <span>Close</span>
          </Button>
        </div>
      </div>

      {/* Main PDF Display Canvas */}
      <div className="relative min-h-[400px] h-[600px] sm:h-[750px] lg:h-[850px] w-full bg-slate-900 flex flex-col items-center justify-center">
        {/* Loading State Overlay */}
        {isLoading && !hasError && !isWebPageNotice && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xs p-6 text-center pointer-events-none">
            <Loader2 className="h-10 w-10 text-brand-400 animate-spin mb-4" />
            <h3 className="text-base font-bold text-white mb-1">
              Loading Official Notification PDF...
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Streaming authentic gazette notice from <span className="font-semibold text-slate-200">{domain}</span>
            </p>
          </div>
        )}

        {/* Webpage / Portal Notification Notice */}
        {isWebPageNotice ? (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
              <Globe className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Official Web Notification Portal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              The issuing authority publishes this notification on their official web portal rather than as a standalone PDF document. You can access the complete official circular directly on the authority website.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 font-bold bg-[#013089] hover:bg-[#01276E] text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Notification on {domain}</span>
                </Button>
              </a>
            </div>
          </div>
        ) : hasError ? (
          /* Error Fallback Display */
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-4 border border-amber-500/20">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Official PDF Unavailable for Inline Viewing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              The official document at <strong className="text-slate-200">{domain}</strong> could not be streamed inline or returned an access restriction. You can view or download the authentic circular directly from the official portal.
              {errorMessage && (
                <span className="block mt-2 text-[11px] font-mono text-amber-300/80 bg-slate-950 p-2 rounded border border-slate-800">
                  {errorMessage}
                </span>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 font-bold bg-[#013089] hover:bg-[#01276E] text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open on {domain}</span>
                </Button>
              </a>

              <Button
                variant="outline"
                size="md"
                onClick={handleRetry}
                className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Loading</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Native Interactive PDF Embed */
          <iframe
            key={proxyUrl}
            src={proxyUrl}
            title={title}
            className="w-full h-full border-0 bg-white"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
      </div>

      {/* Viewer Footer Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive PDF Canvas (Browser zoom &amp; print supported)</span>
        </div>
        <div className="hidden sm:block font-mono text-[10px] text-slate-500 truncate max-w-sm">
          {url}
        </div>
      </div>
    </div>
  );
}
