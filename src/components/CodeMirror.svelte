<div class="wrapper" style="height: {height}; width: {width};">
  <div name="editor" id="CMeditor" bind:this='{CodeMirrorEditor}' >
  </div>
</div>

<style>
  #CMeditor {
    height: 100%;
    width: 100%;
  }
  .wrapper {
    position: absolute;
  }

  :global(.cm-wrap) {
    height: 100%;
  }

  :global(.cm-scroller) { 
    overflow: auto; 
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { markdown } from "@codemirror/lang-markdown"
  import { oneDark } from "@codemirror/theme-one-dark"
  import { highlightSpecialChars, drawSelection, highlightActiveLine, keymap, EditorView } from '@codemirror/view';
  import { EditorState, Prec } from '@codemirror/state';
  import { history, historyKeymap } from '@codemirror/history';
  import { indentOnInput } from '@codemirror/language';
  import { lineNumbers } from '@codemirror/gutter';
  import { defaultKeymap } from '@codemirror/commands';
  import { bracketMatching } from '@codemirror/matchbrackets';
  import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
  import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
  import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
  import { commentKeymap } from '@codemirror/comment';
  import { rectangularSelection } from '@codemirror/rectangular-selection';
  import { defaultHighlightStyle } from '@codemirror/highlight';
  import { lintKeymap } from '@codemirror/lint';
  import { javascript } from '@codemirror/lang-javascript';

  const dispatch = createEventDispatcher();
  
  export let height;
  export let width;
  export let config;
  export let initFinished = false;

  let CodeMirrorEditor;
  let edState;
  let edView;
  let editorFunctions;
  let currentCursor;

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function setValue(text) {
    // 
    // Since we are setting a whole new document, create new editor 
    // states and views.
    // 
    if(initFinished) {
      CreateEditorState(text);
    }
  }

  function CreateEditorState(text) {
    // 
    // Clear out the div element in case a previous editor was
    // created.
    //
    CodeMirrorEditor.innerHTML = '';

    //
    // Setup the extensions array.
    //
    const exts = [
      highlightSpecialChars(),
      history(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      Prec.fallback(defaultHighlightStyle),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      highlightSelectionMatches(),
      keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...commentKeymap,
          ...completionKeymap,
          ...lintKeymap
      ]),
      oneDark,
      EditorView.updateListener.of(update => {
        if(update.docChanged) {
          fire('textChange', {
            value: getValue(),
            cursor: getCursor(),
            history: {}
          })
        }
      })
    ];

    // 
    // Add extensions based on the configuration.
    // 
    if(config.lineNumbers) {
      exts.push(lineNumbers());
    }

    switch(config.language) {
      case 'markdown':
        exts.push(markdown());
        break;
      case 'javascript':
        exts.push(javascript());
        break;
      default: 
        exts.push(markdown());
        break;
    }

    if(config.lineWrapping) {
      exts.push(EditorView.lineWrapping);
    }

    if(config.lineHighlight) {
      exts.push(highlightActiveLine());
    }
    
    // 
    // Create the editor state.
    //
    edState = EditorState.create({
      doc: text,
      extensions: exts
    });

    // 
    // Create the editor View.
    // 
    edView = new EditorView({
      state: edState,
      parent: CodeMirrorEditor
    });
  }

  onMount(() => {
    // 
    // Create the editor.
    // 
    CreateEditorState('');

    //
    // Create the editor functions object.
    //
    editorFunctions = {
      getSelection: getSelection,
      getValue: getValue,
      replaceSelection: replaceSelection,
      somethingSelected: somethingSelected,
      setCursor: setCursor,
      getCursor: getCursor,
      setValue: setValue,
      getLine: getLine,
      focus: focus
    };
    
    //
    // Debugging: add to the window for testing.
    //
    if(typeof window.edFunctions === 'undefined') window.edFunctions = [];
    window.edFunctions.push(editorFunctions);

    //
    // Give the parent the functions for interacting with the editor.
    //
    fire('editorChange', editorFunctions);

    // 
    // Make sure the editor is focused.
    //
    focus();

    //
    // Return a function to run to clean up after mounting.
    //
    return () => {
      // this function runs when the
      // component is destroyed
    };
  });

  function getLine(pos) {
    if(typeof edView !== 'undefined') {
      var result = "";
      return(result);
    }
    return('');
  }

  function getSelection() {
    if(typeof edView !== 'undefined') {
      return edView.state.sliceDoc(
        edView.state.selection.main.from,
        edView.state.selection.main.to);
    }
  }

  function replaceSelection(newText) {
    if(typeof edView !== 'undefined') {
      let transaction = edView.state.update({changes: [{from: edView.state.selection.main.from, to: edView.state.selection.main.to}, {from: 0, insert: newText}]});
      edView.dispatch(transaction);
    }
  }

  function somethingSelected() {
    if(typeof edView !== 'undefined') {
      return edView.state.selection.ranges.some(r => !r.empty);
    }
  }

  function setCursor(pos) {
    if(typeof edView !== 'undefined') {
      currentCursor = pos;
      edView.dispatch({selection: {anchor: currentCursor}})
    }
  }

  function getCursor() {
    if(typeof edView !== 'undefined') {
      currentCursor = edView.state.selection.main.head;
      return(currentCursor);
    } else {
      return(0);
    }
  }

  function getValue() {
    if(typeof edView !== 'undefined') {
      return edView.state.doc.toString();
    }
  }

  function focus() {
    if(typeof edView !== 'undefined') {
      edView.focus();
    }
  }
</script>
