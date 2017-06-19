# Text2D


      const text = new BABYLON.Text2D('Welcome !', {
         id: 'text',
         parent: scene.initialCanvas,
         fontName: '15pt Verdana',
         marginAlignment: 'h: center, v:center',
         fontSuperSample: true,
         defaultFontColor: new BABYLON.Color4(0, 0, 0, 1),
       })

# Async
If you use delay() beware that the PAUSE system will not work properly, since delay does not rely on events, timing cannot be frozen for the state. 
