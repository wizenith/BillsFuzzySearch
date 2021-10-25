// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "bill\'s fuzzy search " is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.BillFuzzySearch', async () => {
      // The code you place here will be executed every time your command is executed

      function getLines() {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
          const document = editor.document;

          // Get the document text
          const documentText = document.getText();
          const lines = documentText.split('\n');
          return lines
            .map((line: string, index: number) => ({ line: line.trim(), index }))
            .filter((l) => l.line && l.line.match(/\w+/));
        }
        return [];
      }

      function gotoLine(lineNumber: number) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const range = editor.document.lineAt(lineNumber - 1).range;
          editor.selection = new vscode.Selection(range.start, range.start);
          editor.revealRange(range);
        }
      }

      let lines = getLines();
      let choices = lines.map((el, idx) => ({
        label: el.line,
        hidden_label: el.line.toLowerCase(),
        index: el.index,
      }));
      // let tmp = Object.assign([], choices);

      let tmp: any = [...choices];
      // let hidden_tmp = [...choices];
      const quickPick = vscode.window.createQuickPick<vscode.QuickPickItem & { index: number }>();

      // uncomment the line below when the testing is fine
      quickPick.items = tmp;

      // let test_obj = [
      //   { label: 'Michael', distance: 0, index: 2 },
      //   { label: 'Peter', distance: 0, index: 3 },
      //   { label: 'WINLAB', distance: 0, index: 4 },
      // ];

      // let tmp: any = Array.from(test_obj);
      // let hidden_tmp = Array.from(test_obj);
      // //test
      // quickPick.items = test_obj;

      const fuzzySearch = (list: any, searchValue: string) => {
        if (!searchValue.match(/\w/)) {
          return list;
        }
        let buf = '.*' + searchValue.replace(/(.)/g, '$1.*').toLowerCase();
        var reg = new RegExp(buf);
        let newList = list.filter(function (e: any) {
          return reg.test(e.label.toLowerCase());
        });
        return newList;
      };

      let sq: any;
      // let sqindex = [];
      quickPick.onDidChangeValue(async (query: string) => {
        if(query===sq){
          return
        }
         sq = query.concat('*');
        quickPick.value = sq
      });
      quickPick.onDidChangeActive((arr)=>{
      	console.log("active event changed:", arr);
      })
      quickPick.onDidChangeSelection((selection) => {
        // console.log('selection ->', selection);
        // if((selection[0] as any).end) {
        //   quickPick.hide();
        //   quickPick.items = choices;
        //   quickPick.value ='';
        //   quickPick.show();
        // }
        gotoLine((selection[0] as any).index + 1);
        quickPick.hide();
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
      // Display a message box to the user
      vscode.window.showInformationMessage('BILL LAB!');

      console.log('show debug mode');
    })
  );
}
