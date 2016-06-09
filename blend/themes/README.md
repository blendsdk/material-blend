# Material Blend Theme SDK

This package provides a set of compass/sass mixins that can be used
to create custom themes for a MaterialBlend application.

This package is automatically installed by the `material-blend` (npm)

Should you event need to install this package manually then you need to
add `add_import_path` to your config.rb.

```
# Example adding an import path

project_path = File.dirname(__FILE__) + '/'

add_import_path project_path + 'node_modules/material-blend-theme-sdk'

```

```
# my.app.scss
# Using the toolset from four sass file

@import "material/material";
@import "material/variables";

/* your rules here */
```



