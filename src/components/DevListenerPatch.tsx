'use client';

// @ts-nocheck -- React Compiler has issues with EventTarget prototype patching
// eslint-disable react-hooks/static-components
// react-compiler-ignore

import { useLayoutEffect } from 'react';

// Quick, defensive module-level patch so it executes as early as possible when
// the module is imported. This helps stop third-party libs from attaching
// non-passive wheel/touchmove listeners before React effects run.
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    const orig = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      try {
        if (type === 'wheel' || type === 'touchmove') {
          if (typeof options === 'boolean') {
            options = { capture: options, passive: true };
          } else if (options == null) {
            options = { passive: true };
          } else if (typeof options === 'object') {
            const o = options as AddEventListenerOptions;
            options = { ...o, passive: o.passive === false ? false : true };
          }
        }
      } catch {
        // ignore and continue with original args
      }
      return orig.call(this, type, listener, options);
    };
    console.info('[dev] Module-level listener patch applied (early): forcing passive for wheel/touchmove listeners');
  } catch {
    // swallow
  }
}

export default function DevListenerPatch(): null {
  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const original = EventTarget.prototype.addEventListener;
    let patched = false;

    // eslint-disable-next-line react-hooks/unsupported-syntax
    function patchedAddEventListener(this: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      // Only patch in development and for the known noisy event types
      if (type === 'wheel' || type === 'touchmove') {
        try {
          // Normalize options robustly for all call shapes
          if (typeof options === 'boolean') {
            options = { capture: options, passive: true };
          } else if (options == null) {
            options = { passive: true };
          } else if (typeof options === 'object') {
            // Preserve other properties but force passive unless explicitly true/false
            const o = options as AddEventListenerOptions;
            options = { ...o, passive: o.passive === false ? false : true };
          }

          patched = true;
        } catch {
          // If normalization fails for any reason, fall back to original behavior
          // but continue execution so we don't break third-party code.
        }
      }

      return original.call(this, type, listener, options);
    }

    // Apply patch in case the module-level patch didn't run early enough
    EventTarget.prototype.addEventListener = patchedAddEventListener;

    if (patched) {
      // Only log in dev to avoid spamming test outputs
      console.info('[dev] Applied listener patch: forcing passive for wheel/touchmove listeners');
    }

    return () => {
      // Restore original
    EventTarget.prototype.addEventListener = original;
      if (patched) {
        console.info('[dev] Restored original addEventListener');
      }
    };
  }, []);

  return null;
}
