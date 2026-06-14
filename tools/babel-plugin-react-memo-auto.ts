import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: "react-memo-auto",
    visitor: {
      FunctionDeclaration(path) {
        const node = path.node;
        const hasState = node.body.body.some(
          (stmt) => t.isVariableDeclaration(stmt) && stmt.declarations.some((d) => d.init && t.isCallExpression(d.init) && (d.init.callee as t.Identifier)?.name === "useState")
        );

        if (!hasState) {
          path.replaceWith(t.variableDeclaration("const", [
            t.variableInit(node.id, t.callExpression(t.identifier("React.memo"), [node])),
          ]));
        }
      },
    },
  };
});
