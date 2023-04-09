/**
 * the One
 */
export class One {
  /**
   * The dependencies of the component
   */
  public deps: Record<string, typeof One> = {};

  public els: HTMLElement[] = [];

  /**
   * Render the component
   * @param el
   * @param parent
   * @param slots
   * @returns
   */
  public mount(
    el: HTMLElement,
    parent?: One,
    slots?: Record<string, ChildNode[]>
  ) {
    this._i();
    const res = this._h(el, true, {}, parent, slots);
    this.mounted();
    return res;
  }

  /**
   * Emit a event to parent
   * @param name
   * @param value
   */
  protected emit(name: string, value: any) {
    this._emits.dispatchEvent(new CustomEvent(name, { detail: value }));
  }

  /**
   * The template of the component
   */
  protected render() {
    return ``;
  }

  /**
   * The lifecycle hook that is called when the component is mounted
   */
  protected mounted() {}

  /**
   * The EventTarget that inside the component
   */
  private _event = new EventTarget();

  /**
   * The EventTarget that between parent and child
   */
  private _emits = new EventTarget();

  /**
   * Initialize the component
   */
  private _i() {
    const props = Object.keys(this);
    props.map((p) => {
      if (p.startsWith("_") || p === "deps") return;
      this._r(p);
    });
  }

  /**
   * Add a Event listener
   * @param event
   * @param callback
   */
  private _ae(callback: () => void) {
    this._event.addEventListener("change", callback);
  }

  /**
   * Dispatch Event
   * @param value
   */
  private _de() {
    this._event.dispatchEvent(new CustomEvent("change"));
  }

  /**
   * Handle a element
   * @param el
   * @param isRoot
   * @param scopeObj
   * @param parent
   * @param slots
   * @returns
   */
  private _h(
    el: HTMLElement,
    isRoot: boolean,
    scopeObj: Record<string, any>,
    parent?: One,
    slots?: Record<string, ChildNode[]>
  ): Record<string, ChildNode[]> | undefined {
    if (el.nodeType == 8) return;

    if (isRoot) {
      el.innerHTML = this.render();
      this._de();
    }
    let attrs = el.getAttributeNames();
    let end = false;
    attrs.forEach((attr) => {
      if (end) return;
      const attrValue = el.getAttribute(attr);
      if (attrValue === null) return;
      if (attr.startsWith(":")) {
        attr = attr.replace(":", "");
        const propertyName = attr as keyof this;
        if (parent && this[propertyName] !== undefined) {
          const handleChange = () => {
            this._event.removeEventListener("change", handleChange);
            this[propertyName] = parent._f(attrValue as string, scopeObj);
            this._ae(handleChange);
          };
          this[propertyName] = parent._f(attrValue as string, scopeObj);
          this._ae(handleChange);
        } else {
          const propertyValue = this._f(attrValue, scopeObj);
          const handleChange = () => {
            if (typeof propertyValue == "boolean") {
              if (propertyValue) {
                el.setAttribute(attr, "");
              } else {
                el.removeAttribute(attr);
              }
            } else if (
              typeof propertyValue == "string" ||
              typeof propertyValue == "number"
            ) {
              el.setAttribute(attr, `${propertyValue}`);
            } else {
              el.removeAttribute(attr);
            }
          };
          handleChange();
          this._ae(handleChange);
        }
      } else if (attr.startsWith("@") && typeof attrValue == "string") {
        const eventAttr = attr.replace("@", "");
        if (parent) {
          this._emits.addEventListener(eventAttr, (e) => {
            const customEvent = e as CustomEvent;
            parent._f(attrValue, scopeObj).call(parent, customEvent.detail);
          });
        } else {
          el.addEventListener(eventAttr, (e) => {
            this._f(attrValue, scopeObj).call(this, e);
          });
        }
        el.removeAttribute(attr);
      } else if (attr == "v-text" && typeof attrValue == "string") {
        const handleChange = () => {
          el.innerHTML = this._f(attrValue, scopeObj);
        };
        this._ae(handleChange);
        handleChange();
      } else if (attr == "v-if" && typeof attrValue == "string") {
        const parentNode = el.parentNode;
        if (!parentNode) return;
        let ifComment = document.createComment("if");
        const isTrue = this._f(attrValue, scopeObj);
        const hide = () => {
          parentNode.insertBefore(ifComment, el);
          el = parentNode.removeChild(el);
        };
        if (!isTrue) hide();

        let prevIsTrue = isTrue;
        this._ae(() => {
          const isTrue = this._f(attrValue, scopeObj);
          if (prevIsTrue === isTrue) return;
          prevIsTrue = isTrue;
          if (isTrue) {
            const parentNode = ifComment.parentNode;
            if (!parentNode) return;
            parentNode?.insertBefore(el, ifComment);
            ifComment = parentNode.removeChild(ifComment);
          } else {
            const parentNode = el.parentNode;
            if (!parentNode) return;
            hide();
          }
        });
      } else if (attr == "v-for") {
        let f = attrValue.split(" in ");
        let tmpl = el.cloneNode(true) as HTMLElement;
        tmpl.removeAttribute("v-for");
        let scopeObject: any = {};
        const parentNode = el.parentNode;
        if (!parentNode) return;
        let forStart = document.createComment("for");
        parentNode.insertBefore(forStart, el);
        let forEnd = document.createComment("for-end");
        parentNode.insertBefore(forEnd, el.nextSibling);
        el = parentNode.removeChild(el);
        const onChange = () => {
          let endIndex = Array.prototype.indexOf.call(
            parentNode.childNodes,
            forEnd
          );
          let startIndex = Array.prototype.indexOf.call(
            parentNode.childNodes,
            forEnd
          );
          // let endIndex = children.indexOf(forEnd);
          // let startIndex = children.indexOf(forStart);
          for (let i = endIndex - 1; i > startIndex + 1; i--) {
            parentNode.removeChild(parentNode.childNodes[i]);
          }
          for (let i of this._f(f[1], scopeObject)) {
            let cx = tmpl.cloneNode(true) as HTMLElement;
            if (cx) {
              forEnd.parentNode?.insertBefore(cx, forEnd);
              scopeObject[f[0]] = i;
              this._h(cx as HTMLElement, false, scopeObject, undefined, slots);
            }
          }
        };
        this._ae(onChange);
        onChange();
        end = true;
      } else {
        const propertyName = attr as keyof this;
        if (typeof this[propertyName] == "string") {
          this[propertyName] = attrValue as any;
        }
      }
    });

    if (!end) {
      this._hc(el, scopeObj, slots);
    }
    if (el.tagName.startsWith("SLOT") && slots) {
      const slotSuffix = el.tagName.replace("SLOT", "");
      el.innerHTML = "";
      let key = slotSuffix === "" ? "" : slotSuffix;
      if (slots[key]) {
        el.append(...slots[key]);
      }
    }

    if (el.tagName.startsWith(`TPL`)) {
      const children: HTMLElement[] = [];
      for (let i = 0; i < el.childNodes.length; i++) {
        children.push(el.childNodes[i] as HTMLElement);
      }
      const parent = el.parentNode;
      if (!parent) return;
      parent.removeChild(el);
      return {
        [el.tagName.replace(`TPL`, "")]: children,
      };
    }
    if ((isRoot && el.tagName != "DIV") || el.tagName.startsWith("SLOT")) {
      const children: HTMLElement[] = [];
      const parent = el.parentNode;
      if (!parent) return;
      const l = el.childNodes.length;
      for (let i = 0; i < l; i++) {
        children.push(parent.insertBefore(el.childNodes[0], el) as HTMLElement);
      }
      parent.removeChild(el);
      return { "": children };
    }
    return { "": [el] };
  }

  /**
   * eval Function
   * @param src
   * @param scopeObj
   * @returns
   */
  private _f(src: string, scopeObj: any) {
    const props = Object.getOwnPropertyNames(this);
    let funcs = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const scopeKeys = Object.keys(scopeObj ?? {});
    return new Function(...props, ...funcs, ...scopeKeys, `return ${src}`)(
      ...props.map((p) => this[p as keyof One]),
      ...funcs.map((f) => this[f as keyof One]),
      ...scopeKeys.map((k) => scopeObj[k])
    );
  }

  /**
   * Merge Slots
   * @param a
   * @param b
   * @returns
   */
  private _ms(a: Record<string, ChildNode[]>, b: Record<string, ChildNode[]>) {
    const keys = Object.keys(a);
    const keys2 = Object.keys(b);
    const allKeys = [...keys, ...keys2];
    const ret: Record<string, ChildNode[]> = {};
    allKeys.forEach((k) => {
      ret[k] = [...(a[k] ?? []), ...(b[k] ?? [])];
    });
    return ret;
  }

  /**
   * Handle Children
   * @param el
   * @param scopeObj
   * @param slots
   * @returns
   */
  private _hc(
    el: HTMLElement,
    scopeObj: Record<string, any>,
    slots?: Record<string, ChildNode[]>
  ): Record<string, ChildNode[]> {
    const l = el.childNodes.length;
    const allChildren: ChildNode[] = [];
    let newSlots: Record<string, ChildNode[]> = {};
    // 途中でchildNodesの長さが変わるので、一旦配列に入れてから処理する
    for (let i = 0; i < l; i++) {
      const child = el.childNodes[i];
      allChildren.push(child);
    }
    allChildren.forEach((child) => {
      const lowerTagName =
        child instanceof HTMLElement ? child.tagName.toLowerCase() : "";
      const Class = this.deps[lowerTagName];
      if (Class) {
        const c = new Class();
        Object.keys(this.deps).forEach((k) => {
          if (c.deps[k]) return;
          c.deps[k] = this.deps[k];
        });

        let childSlots = {};
        if (child instanceof HTMLElement) {
          childSlots =
            c.mount(
              child,
              this,
              this._ms(slots ?? {}, this._hc(child, scopeObj, slots))
            ) ?? {};
        } else {
          childSlots = { "": [child] };
        }
        if (childSlots) {
          newSlots = this._ms(newSlots, childSlots);
        }
      } else {
        const childSlots =
          child instanceof HTMLElement
            ? this._h(child, false, scopeObj, undefined, slots)
            : { "": [child] };
        if (childSlots) {
          newSlots = this._ms(newSlots, childSlots);
        }
      }
    });
    return newSlots;
  }

  /**
   * convert to Reactive
   * @param name property name
   * @returns
   */
  private _r(name: string) {
    let _internal = this[name as keyof this] as any;
    if (typeof _internal === "function") return;
    if (typeof _internal === "object") {
      const handler: ProxyHandler<any> = {
        get: (obj, k) => new Proxy(obj[k], handler),
      };
      this[name as keyof this] = new Proxy(_internal, {
        get(obj, k) {
          if (typeof obj[k] == "object") {
            return new Proxy(obj[k], handler);
          }
          return obj[k];
        },
        set: (obj, k, v) => {
          obj[k] = v;
          this._de();
          return true;
        },
      });
    } else {
      Object.defineProperty(this, name, {
        get: () => {
          return _internal;
        },
        set: (value: any) => {
          _internal = value;
          this._de();
        },
      });
    }
  }
}
