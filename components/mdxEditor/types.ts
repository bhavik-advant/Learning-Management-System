export type MarkdownEditorProps = {
  value: string
  onChange : (value: string) => void
  placeholder?: string
  className?: string
  contentEditableClassName?: string
  courseId?: string
  moduleId?: string
  /**
   * Controls whether the top toolbar is shown.
   * When omitted, the toolbar is shown (backwards compatible).
   */
  isEditing?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  spellCheck?: boolean
}
