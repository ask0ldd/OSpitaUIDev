export interface IRunningModelsResponse {
    models : IRunningModelInfo[]
}

interface IRunningModelInfo {
    name: string
    model: string
    size: number
    digest: string
    details: {
      parent_model: string
      format: string
      family: string
      families: string[]
      parameter_size: string
      quantization_level: string
    },
    expires_at: string
    size_vram: number
}