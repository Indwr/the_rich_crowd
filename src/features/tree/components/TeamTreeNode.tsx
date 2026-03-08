import { type TeamTreeNode } from "../services/treeAPI";

interface TeamTreeNodeProps {
  node: TeamTreeNode | null;
  depth: number;
  maxDepth: number;
  onNodeClick: (nodeId: string | number) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB");
};

const getLeftAndRightChild = (children?: TeamTreeNode[]) => {
  const safeChildren = children ?? [];
  const left = safeChildren.find((child) => child.position === "left") ?? safeChildren[0] ?? null;
  const right =
    safeChildren.find((child) => child.position === "right") ??
    (left === safeChildren[0] ? safeChildren[1] : safeChildren[0]) ??
    null;
  return { left, right };
};

const TeamTreeNodeCard = ({ node, depth, maxDepth, onNodeClick }: TeamTreeNodeProps) => {
  if (!node) {
    return (
      <>
        <div className="node-card empty">
          <div className="node-icon">
            <i className="fas fa-plus" />
          </div>
          <span className="node-id">Empty</span>
        </div>
        {depth < maxDepth && (
          <ul>
            <li>
              <TeamTreeNodeCard
                node={null}
                depth={depth + 1}
                maxDepth={maxDepth}
                onNodeClick={onNodeClick}
              />
            </li>
            <li>
              <TeamTreeNodeCard
                node={null}
                depth={depth + 1}
                maxDepth={maxDepth}
                onNodeClick={onNodeClick}
              />
            </li>
          </ul>
        )}
      </>
    );
  }

  const leftBusiness = Number(node.left_business ?? 0);
  const rightBusiness = Number(node.right_business ?? 0);
  const totalBusiness = leftBusiness + rightBusiness;
  const { left, right } = getLeftAndRightChild(node.children);

  return (
    <>
      <div
        className="node-card active"
        onClick={() => onNodeClick(node.node_id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onNodeClick(node.node_id);
          }
        }}
      >
        <span className="node-status status-red" />
        <div className="node-icon">
          <i className="fas fa-user" />
        </div>
        <span className="node-id">{node.node_id}</span>
        <div
          className="on-card-stats"
          style={{
            display: "flex",
            gap: 10,
            marginTop: 8,
            background: "rgba(0,0,0,0.6)",
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="stat"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "0.65rem",
              color: "#ddd",
            }}
          >
            <span
              style={{
                color: "var(--gold-primary)",
                fontWeight: 700,
                fontSize: "0.6rem",
              }}
            >
              LEFT
            </span>
            ${leftBusiness}
          </div>
          <div
            className="stat"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "0.65rem",
              color: "#ddd",
            }}
          >
            <span
              style={{
                color: "var(--gold-primary)",
                fontWeight: 700,
                fontSize: "0.6rem",
              }}
            >
              RIGHT
            </span>
            ${rightBusiness}
          </div>
        </div>
        <div className="node-tooltip">
          <div className="tooltip-row">
            <span>Total Biz:</span> <strong>${totalBusiness}</strong>
          </div>
          <div className="tooltip-row">
            <span>Left Biz:</span> <strong>${leftBusiness}</strong>
          </div>
          <div className="tooltip-row">
            <span>Right Biz:</span> <strong>${rightBusiness}</strong>
          </div>
          <div className="tooltip-row">
            <span>Position:</span> <span>{node.position ?? "-"}</span>
          </div>
          <div className="tooltip-row">
            <span>Joined:</span> <span>{formatDate(node.created_at)}</span>
          </div>
        </div>
      </div>
      {depth < maxDepth && (
        <ul>
          <li>
            <TeamTreeNodeCard
              node={left}
              depth={depth + 1}
              maxDepth={maxDepth}
              onNodeClick={onNodeClick}
            />
          </li>
          <li>
            <TeamTreeNodeCard
              node={right}
              depth={depth + 1}
              maxDepth={maxDepth}
              onNodeClick={onNodeClick}
            />
          </li>
        </ul>
      )}
    </>
  );
};

export default TeamTreeNodeCard;

