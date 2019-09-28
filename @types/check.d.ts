export type Conclusion =
  | 'success'
  | 'failure'
  | 'neutral'
  | 'cancelled'
  | 'timed_out'
  | 'action_required'

export type AnnotationLevel =
  | 'warning'
  | 'failure'
  | 'notice'
