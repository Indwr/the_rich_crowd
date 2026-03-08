import TeamTreeNode from "./TeamTreeNode";
import { useTeamTree } from "../hooks/useTeamTree";

const TeamTreeView = () => {
  const { tree, isLoading, error, selectNode, selectedNodeId, resetTree } = useTeamTree();

  return (
    <div className="content-wrapper">
      <div className="tree-page-header">
        <h1 className="tree-title">
          <i className="fas fa-network-wired" /> My Tree
        </h1>
        <div style={{ marginTop: 8, color: "#ccc", fontSize: "0.9rem" }}>
          Active Node: {selectedNodeId || "root"}
          {selectedNodeId && (
            <button
              type="button"
              onClick={() => void resetTree()}
              style={{ marginLeft: 10, cursor: "pointer",backgroundColor: "var(--gold-primary)", color: "var(--dark-bg)", border: "none", padding: "5px 10px", borderRadius: "5px" }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="tree-scroll-container">
        {isLoading && <div className="tree-loader">Loading tree...</div>}
        {!isLoading && error && <div className="tree-loader">Failed to load tree: {error}</div>}
        {!isLoading && !error && tree && (
          <div className="tree">
            <ul>
              <li>
                <TeamTreeNode
                  node={tree}
                  depth={0}
                  maxDepth={3}
                  onNodeClick={(nodeId) => void selectNode(nodeId)}
                />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTreeView;

