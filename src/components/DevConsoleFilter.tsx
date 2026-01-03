"use client";

import { useEffect } from "react";

// Quick, defensive module-level patch so it executes as early as possible when
// the module is imported. This helps suppress third-party dev toolbar messages
// that log before React effects run.
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    const origConsoleError = console.error;
    const origConsoleWarn = console.warn;
    const origConsoleLog = console.log;
    const origConsoleInfo = console.info;

    const suppressedPatterns: Array<string | RegExp> = [
      /Max reconnection attempts reached/,
      /Attempting to reconnect/i,
      /Download the React DevTools/i,
      /\[HMR\] connected/i,
      /Added non-passive event listener to a scroll-blocking 'wheel' event/i,
      /⬆️⬆️⬆️ Those two errors are expected!/i,
      /No IDE windows found/i,
      /Unable to add filesystem/i,
      /content-script-vimeo\.js/i,
      /log-init/i,
    ];

    function shouldSuppress(first: unknown) {
      if (typeof first !== 'string') return false;
      return suppressedPatterns.some((p) => (p instanceof RegExp ? p.test(first) : first.includes(p)));
    }

    console.error = (...args: Parameters<typeof console.error>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleError.apply(console, args);
    };

    console.warn = (...args: Parameters<typeof console.warn>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleWarn.apply(console, args);
    };

    console.log = (...args: Parameters<typeof console.log>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleLog.apply(console, args);
    };

    console.info = (...args: Parameters<typeof console.info>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleInfo.apply(console, args);
    };

    console.info('[dev] Module-level console filter applied (early): suppressing noisy dev messages');
  } catch {
    // swallow
  }
}

/**
 * Dev-only console filter
 * - suppresses noisy third-party dev toolbar reconnect messages
 * - restores original console.error on unmount
 *
 * NOTE: this is a temporary, local mitigation — consider filing an upstream
 * issue/PR with @21st-extension/toolbar to handle reconnect logging more
 * gracefully (or expose a config option).
 */
export default function DevConsoleFilter() {
  useEffect(() => {
    const origConsoleError = console.error;
    const origConsoleWarn = console.warn;
    const origConsoleLog = console.log;
    const origConsoleInfo = console.info;

    const suppressedPatterns: Array<string | RegExp> = [
      /Max reconnection attempts reached/,
      /Attempting to reconnect/i,
      /Download the React DevTools/i,
      /\[HMR\] connected/i,
      /Added non-passive event listener to a scroll-blocking 'wheel' event/i,
      /⬆️⬆️⬆️ Those two errors are expected!/i,
      /No IDE windows found/i,
      /Unable to add filesystem/i,
      /content-script-vimeo\.js/i,
      /log-init/i,
    ];

    function shouldSuppress(first: unknown) {
      if (typeof first !== 'string') return false;
      return suppressedPatterns.some((p) => (p instanceof RegExp ? p.test(first) : first.includes(p)));
    }

    console.error = (...args: Parameters<typeof console.error>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleError.apply(console, args);
    };

    console.warn = (...args: Parameters<typeof console.warn>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleWarn.apply(console, args);
    };

    console.log = (...args: Parameters<typeof console.log>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleLog.apply(console, args);
    };

    console.info = (...args: Parameters<typeof console.info>) => {
      try {
        const first = args[0];
        if (shouldSuppress(first)) return;
      } catch {
        // ignore
      }
      return origConsoleInfo.apply(console, args);
    };

    return () => {
      console.error = origConsoleError;
      console.warn = origConsoleWarn;
      console.log = origConsoleLog;
      console.info = origConsoleInfo;
    };
  }, []);

  return null;
}
