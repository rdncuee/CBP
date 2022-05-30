<h1><strong>Code Block Programming Interaction</strong></h1>

<h2>Overview</h2>
<p>PCI is the interaction (component for authoring a problem item) required to create a unique form of problem. On TAO, you can create a typical problem item by using QTI (general interaction prepared as standard), but it seems to be a requirement in this case programming problem. Since the interaction for creating problem items is not provided as standard, it is necessary to develop PCI to enable the creation of problem items for programming problems. (tentative)</p>
<hr>

<h2>Description</h2>
<p><strong>About Code Block Programming Interaction</strong></p>
<ul>
<li>You can create programming questions on the authoring screen of TAO items.</li>
<li>You can create a programming question by adding an icon for creating a programming question and dragging and dropping the icon to the blank question creation page in Custom Interaction.</li>
<li>短Automatic indentation is performed according to the program syntax for the program code fragments composed by arranging the books side by side.</li>
<li>You can add and execute inputs to a program composed of strips side by side.</li>
<li>You can enter any value, expression, conditional statement, etc. in the blanks in the strip.</li>
<li>Any character string such as a pseudo language can be set for the display label of the strip, and one line or multiple lines of JavaScript code can be associated with each strip.</li>
<li>You can check the execution result of the program when creating a question and when asking a question.</li>
<li>You can create problems in combination with the Interactions that come standard with TAO.</li>
</ul>

<h2>Getting Started</h2>
<ol>
    <li>Download this code as a zip</li>
    <li>Compress the following unzipped directories into a zip</li>
    <li>Log in to TAO</li>
    <li>Go to Item> Authoring</li>
    <li>Open the Custom Interactions menu and click Manage Custom Operations</li>
    <li>Click "Add Interaction"</li>
    <li>Drag and drop the zip file created above and click "Upload"<br>
    <strong>Note) The version written in pciCreator.json must be the same or higher. It is not possible to lower the version and upload it.</strong>
    </li>
</ol>


<h2>Usage</h2>

<b>How to change the color of the CodeBlock</b>

```
/runtime/base.css

<PROCESS> line 122：
.rectangle[data-rectangle-type=process] {
   background-color: <color>;
}

<WHILE and FOR> line 130：
.rectangle[data-rectangle-type=while], .rectangle[data-rectangle-type=for]
{
   background-color: <color>;  
}

<IF and IF ELSE> line 159：
.rectangle[data-rectangle-type=ifElse], .rectangle[data-rectangle-type=if] {
   background-color: <color>;  
}
```

<b>How to change the CodeBlock icon</b>

```
１．Insert the image of the icon you want to change in "/runtime/img/"
２．Change the "/runtime/base.css{background-image:url}"
```

<b>How to change the font of the CodeBlock icon</b>

```
/runtime/base.css

If you want to support the display in all strips
line 476：
.qti-item, .show-value{
    font-family: 'Courier New', Courier, 'Yu Gothic', 'MS Gothic', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Osaka-Mono', monospace !important;
}

When you want to correspond to TextField
line 482：
input.form-rect{
    font-family: 'Courier New', Courier, 'Yu Gothic', 'MS Gothic', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Osaka-Mono', monospace !important;
}

If you want to change the font of SelectBox
line 491：
.form-rect-select{
    font-family: 'Courier New', Courier, 'Yu Gothic', 'MS Gothic', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Osaka-Mono', monospace !important;
}
```

<b>How to change the characters that can be entered in the text box</b>
```
/creator/widget/states/Answer.js
line 51：
return value.replace(/(\,|\'|\"|\!|\=|\/|\+|\-|\~|\*|\%|\<|\>|\||\&|\?|\^|\(|\))/g,'');
//Change the regular expression character for replace here
```

<b>How to change the characters in the CodeBlock </b>
```
/creator/tpl/rectangle.tpl
line 9
```
<hr>

## TAO Version
3.3.0-RC02

<hr>

## Author
The National Center for University Entrance Examinations

<hr>

## License
