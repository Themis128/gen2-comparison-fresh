// Browser Polyfills for Contact Form Compatibility
// This file provides fallbacks for older browsers
// Only run in browser environment
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */

if (typeof window !== 'undefined') {

  // Polyfill for Element.prototype.matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      (Element.prototype as any).msMatchesSelector ||
      (Element.prototype as any).webkitMatchesSelector ||
      function (this: Element, s: string) {
        const matches = ((this as any).document || (this as any).ownerDocument).querySelectorAll(s);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) { }
        return i > -1;
      };
  }

  // Polyfill for Element.prototype.closest
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s: string) {
      let el: Element | null = this;
      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || (el.parentNode as Element);
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // Polyfill for Array.prototype.includes
  if (!Array.prototype.includes) {
    Array.prototype.includes = function <T>(this: T[], searchElement: T, fromIndex?: number): boolean {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      const o = Object(this);
      const len = o.length >>> 0;

      if (len === 0) {
        return false;
      }

      const n = fromIndex || 0;
      let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      return false;
    };
  }

  // Polyfill for String.prototype.includes
  if (!String.prototype.includes) {
    String.prototype.includes = function (search: string, start?: number): boolean {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }

  // Polyfill for Object.assign
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target: any, ...sources: any[]): any {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (let index = 1; index < sources.length; index++) {
        const source = sources[index];
        if (source != null) {
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  // Basic Promise polyfill for very old browsers
  if (typeof Promise === 'undefined') {
    interface PromiseExecutor<T> {
      (resolve: (value: T) => void, reject: (reason?: unknown) => void): void;
    }

    (window as any).Promise = function <T>(executor: PromiseExecutor<T>) {
      this._state = 'pending';
      this._value = undefined;
      this._callbacks = [];

      const resolve = (value: T) => {
        if (this._state === 'pending') {
          this._state = 'fulfilled';
          this._value = value;
          this._callbacks.forEach((callback: any) => callback(value));
        }
      };

      const reject = (reason: any) => {
        if (this._state === 'pending') {
          this._state = 'rejected';
          this._value = reason;
        }
      };

      try {
        executor(resolve, reject);
      } catch {
        reject(new Error('Promise executor failed'));
      }
    };

    (window as any).Promise.prototype.then = function <T, U>(onFulfilled: (value: T) => U) {
      return new (window as any).Promise((resolve: (value: U) => void) => {
        const callback = (value: T) => {
          try {
            resolve(onFulfilled(value));
          } catch (error) {
            resolve(value as any);
          }
        };

        if (this._state === 'fulfilled') {
          callback(this._value);
        } else {
          this._callbacks.push(callback);
        }
      });
    };
  }

  // Basic fetch polyfill for very old browsers
  if (typeof fetch === 'undefined') {
    (window as any).fetch = function (url: string, options?: any) {
      return new (window as any).Promise((resolve: (response: any) => void, reject: (error: any) => void) => {
        const xhr = new XMLHttpRequest();
        xhr.open(options?.method || 'GET', url);

        if (options?.headers) {
          Object.keys(options.headers).forEach((key: string) => {
            xhr.setRequestHeader(key, options.headers[key]);
          });
        }

        xhr.onload = () => {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            json: () => new (window as any).Promise((resolve: (data: any) => void) => resolve(JSON.parse(xhr.responseText))),
            text: () => new (window as any).Promise((resolve: (data: string) => void) => resolve(xhr.responseText))
          });
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(options?.body);
      });
    };
  }

} // End browser check