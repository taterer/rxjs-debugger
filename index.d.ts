declare module '@taterer/rxjs-debugger' {
  /**
   * Keep track of subscriptions and emissions through an RxJS pipeline
   * @param tag Tag a pipeline
   * @param tag.name Name the pipeline
   * @param tag.color Color the pipeline
   * @param tag.icon Icon to track the pipeline
   * @returns RxJS OperatorFunction
   */
  export function tag(
    {
      name,
      color,
      icon,
    }: {
      name: string,
      color: string,
      icon: string,
    }
  )
}
