import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = new PokeClockViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("pokeClockView", provider)
  );
}

export function deactivate() {}

class PokeClockViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    try {
      const htmlUri = vscode.Uri.joinPath(
        this.context.extensionUri,
        "media",
        "clock.html"
      );
      const htmlBuffer = await vscode.workspace.fs.readFile(htmlUri);
      let html = Buffer.from(htmlBuffer).toString("utf8");

      html = html.replace(
        /(src|href)="(.+?)"/g,
        (_: string, attr: string, file: string) => {
          const resourcePath = vscode.Uri.joinPath(
            this.context.extensionUri,
            "media",
            file
          );
          const webviewUri = webviewView.webview.asWebviewUri(resourcePath);
          return `${attr}="${webviewUri}"`;
        }
      );

      webviewView.webview.html = html;
    } catch (error) {
      console.error("Failed to load clock.html", error);
      webviewView.webview.html = `<h2>Error loading Poke Clock</h2>`;
    }
  }
}
