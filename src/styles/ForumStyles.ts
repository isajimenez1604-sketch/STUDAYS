
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    padding: 8,
    marginRight: 8,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#1F2937",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  refreshButton: {
    padding: 8,
  },

  createPostCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  formTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },

  titleInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 10,
  },

  contentInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
    minHeight: 90,
    marginBottom: 12,
  },

  publishButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  publishButtonDisabled: {
    opacity: 0.6,
  },

  publishButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },

  postCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  postAuthorInfo: {
    marginLeft: 10,
  },

  postAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  postDate: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  postTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },

  postContent: {
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },

  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  commentLabel: {
    marginLeft: 7,
    fontSize: 12,
    color: "#64748B",
  },

  commentToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    gap: 7,
  },

  commentToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },

  commentsSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  commentsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },

  commentsLoader: {
    marginVertical: 18,
  },

  commentEmptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
    marginBottom: 14,
  },

  commentCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
    gap: 8,
  },

  commentAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },

  commentDate: {
    fontSize: 11,
    color: "#94A3B8",
  },

  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
  },

  commentInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    minHeight: 70,
    fontSize: 14,
    color: "#1F2937",
    marginTop: 4,
    marginBottom: 10,
  },

  sendCommentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  sendCommentButtonDisabled: {
    opacity: 0.6,
  },

  sendCommentButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  statusText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 14,
    textAlign: "center",
  },
});
