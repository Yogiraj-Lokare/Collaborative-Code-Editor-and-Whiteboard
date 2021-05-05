import TextOperation from "./Text-Operation";
import { SelfMeta } from "./Editor-Client";
// A WrappedOperation contains an operation and corresponing metadata.
class WrappedOperation {
  wrapped: TextOperation;
  meta: SelfMeta | null;
  constructor(operation: TextOperation, meta: SelfMeta | null) {
    this.wrapped = operation;
    this.meta = meta;
  }
  apply() {
    //@ts-ignore
    return this.wrapped.apply.apply(this.wrapped, arguments);
  }
  invert() {
    var meta = this.meta;
    return new WrappedOperation(
      //@ts-ignore
      this.wrapped.invert.apply(this.wrapped, arguments),
      meta && typeof meta === "object" && typeof meta.invert === "function"
        ? //@ts-ignore
          meta.invert.apply(meta, arguments)
        : meta
    );
  }
  compose(other: any) {
    return new WrappedOperation(
      this.wrapped.compose(other.wrapped),
      composeMeta(this.meta, other.meta)
    );
  }
  static transform(a: any, b: any) {
    //console.log('a: ',a,'b: ',b);
    var transform = a.wrapped.constructor.transform;
    var pair = transform(a.wrapped, b.wrapped);
    return [
      new WrappedOperation(pair[0], transformMeta(a.meta, b.wrapped)),
      new WrappedOperation(pair[1], transformMeta(b.meta, a.wrapped)),
    ];
  }
}

// Copy all properties from source to target.
function copy(source: any, target: any) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}

function composeMeta(a: any, b: any) {
  if (a && typeof a === "object") {
    if (typeof a.compose === "function") {
      return a.compose(b);
    }
    var meta = {};
    copy(a, meta);
    copy(b, meta);
    return meta;
  }
  return b;
}

function transformMeta(meta: SelfMeta, operation: any) {
  if (meta && typeof meta === "object") {
    if (typeof meta.transform === "function") {
      //console.log(meta);
      return meta.transform(operation);
    }
  }
  return meta;
}

export default WrappedOperation;
