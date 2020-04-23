export class Schema {
  constructor(options) {
    this.fields = options.fields !== undefined ? options.fields : {};
    this.loaders = options.loaders !== undefined ? options.loaders : [];
  }
  load(object) {
    let out = {};
    let field;
    Object.keys(this.fields).forEach(fieldName => {
      field = this.fields[fieldName];
      if (field instanceof Field) {
        out[fieldName] = field.load(object[fieldName]);
      }
    });
    this.loaders.forEach(loader => {
      out = loader(out);
    });
    return out;
  }
}

export class Field {
  constructor(options) {
    options = options !== undefined ? options : {};
    this.loaders = options.loaders !== undefined ? options.loaders : [];
    this.default = options.default;
  }
  load(value) {
    value = value !== undefined ? value : this.default;
    this.loaders.forEach(loader => {
      value = loader(value);
    });
    return value;
  }
}

export class IntField extends Field {
  constructor(options) {
    super(options);

    this.loaders.push(toInt(this.default));
    if (options.minVal !== undefined) {
      this.minVal = options.minVal;
      this.loaders.push(minVal(this.minVal));
    }
    if (options.maxVal !== undefined) {
      this.maxVal = options.maxVal;
      this.loaders.push(maxVal(this.maxVal));
    }
  }
}

export class NumberField extends Field {
  constructor(options) {
    super(options);

    this.loaders.push(toNumber(this.default));
    if (options.minVal !== undefined) {
      this.minVal = options.minVal;
      this.loaders.push(minVal(this.minVal));
    }
    if (options.maxVal !== undefined) {
      this.maxVal = options.maxVal;
      this.loaders.push(maxVal(this.maxVal));
    }
  }
}

// Processors

export function minVal(min) {
  return val => {
    return Math.max(val, min);
  };
}

export function maxVal(min) {
  return val => {
    return Math.min(val, min);
  };
}

export function toInt(defaultValue) {
  return value => {
    let rv = parseInt(value);
    if (isFinite(rv)) return rv;
    return defaultValue;
  };
}
export function toNumber(defaultValue) {
  return value => {
    let rv = parseFloat(value);
    if (isFinite(rv)) return rv;
    return defaultValue;
  };
}
