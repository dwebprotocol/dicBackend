## 5.7.0
- Simplifies internal reference counting and namespace handling. This removes the `NamespacedBasestore` class, but does not alter the interface.
- Uses `refpool` for reference handling.
- Removes `Nanoguard` and the undocumented `this.guard` property on Basestore.
- Removes the private `_name` option to `Basestore.get` in favor of a public `name` option.
