<svelte:head>
    <title>Svelte Codemirror</title>
</svelte:head>

<div id="edContainer">
  <div id="edRow">
    <div id="firstEd">
      <CodeMirror
        height="300px"
        width="500px"
        config={edConfigMD}
        initFinished={loadDone};
        on:textChange={textChange}
        on:editorChange={editorChange}
      />
    </div>
    <div id="secondEd">
      <CodeMirror
        height="300px"
        width="500px"
        config={edConfigJ}
        initFinished={loadDone};
        on:textChange={textChangeJ}
        on:editorChange={editorChangeJ}
      />
    </div>
    <div id="thirdEd">
      <CodeMirror
        height="300px"
        width="500px"
        config={edConfigJ2}
        initFinished={loadDone};
        on:textChange={textChangeJ2}
        on:editorChange={editorChangeJ2}
      />
    </div>
  </div>
  <button on:click={addText} >Add Text</button>
</div>

<style>
  #edContainer {
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 500px;
  }

  #edRow {
    display: flex;
    flex-direction: row;
    width: 1500px;
    height: 300px;
  }

  #firstEd {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  #secondEd {
    position: absolute;
    top: 10px;
    left: 520px;
  }

  #thirdEd {
    position: absolute;
    top: 10px;
    left: 1030px;
  }


  #edContainer button {
    position: absolute;
    bottom: 5px;
    left: 5px;
  }
</style>

<script>
  import CodeMirror from "./components/CodeMirror.svelte";
  import { onMount } from "svelte";

  let loadDone = false;
  let edConfigMD = {
    language: 'markdown',
    lineNumbers: false,
    lineWrapping: true,
    lineHighlight: true
  };
  let edConfigJ = {
    language: 'javascript',
    lineNumbers: true,
    lineWrapping: false,
    lineHighlight: true
  };
  let edConfigJ2 = {
    language: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    lineHighlight: true
  };
  let text = `# This is a test

- A note
- Another note

This is *some* text.

  It is on several lines and is for testing the CodeMirror editor on the web page. This is a test site.

  This is some more text.

  It is on several lines and is for testing the CodeMirror editor on the web page. This is a test site.

  `;
  let cm;
  let textj = `
function test() {
  if(test == null) {
    console.log("not a test")
  } else {
    console.log("a test")
  }
}
  `;
  let cmj;
  let textj2 = `function test() {
  if(test == null) {
    console.log("not a test")
  } else {
    console.log("a test")
  }
}
`;
  let cmj2;


  onMount(() => {
    loadDone = true;
  });

  function textChange(e) {
    text = e.detail.data.value;
  }

  function editorChange(e) {
    cm = e.detail.data;
  }

  function textChangeJ(e) {
    textj = e.detail.data.value;
  }

  function editorChangeJ(e) {
    cmj = e.detail.data;
  }

  function textChangeJ2(e) {
    textj2 = e.detail.data.value;
  }

  function editorChangeJ2(e) {
    cmj2 = e.detail.data;
  }

  function addText(e) {
    if(typeof cm !== 'undefined') {
      text += text;
      cm.setValue(text);
    }
    if(typeof cmj !== 'undefined') {
      textj += textj;
      cmj.setValue(textj);
    }
    if(typeof cmj2 !== 'undefined') {
      textj2 += textj2;
      cmj2.setValue(textj2);
    }
  }
</script>

