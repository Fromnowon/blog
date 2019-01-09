# Quill ImageResize Module with imports error fix

A fork for quill-image-resize-module that fix `"Cannot read property 'imports' of undefined"`
Because the author haven't accept [pull request #38](https://github.com/kensnyder/quill-image-resize-module/pull/38) yet, so I created this fork. 

See Quill ImageResize Module documentation in [here](https://github.com/kensnyder/quill-image-resize-module),

# Usage 

- Download [image-resize.min.js](https://github.com/khasburrahman/quill-image-resize-module-fix-imports-error/raw/master/image-resize.min.js). 
- Save in your project directory 
- import it in your project using `import ImageResize from '<path_to_the_module>';`
- if encounter a warning message `quill Overwriting modules/imgageResize with ƒ` try remove `Quill.register('modules/imageResize', ImageResize);`

# Drawback 

Huge script size! compared to the original, the fix costs more than 200kB!
Maybe, that's the reason why author haven't accept the pull request yet, I don't know
