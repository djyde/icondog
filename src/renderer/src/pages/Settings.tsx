import { Input } from "@nextui-org/react";

export function Settings() {
  return (
    <div>
      <div className="p-5">
        <h1 className="font-medium mb-5 movable">Settings</h1>

        <div>
          <Input spellCheck={false} defaultValue={window.api.store.get('openai-key') as string} onChange={e => {
            const value = e.target.value
            window.api.store.set('openai-key', value)
          }} size="sm" label="OpenAI key" />
        </div>
      </div>

    </div>
  )
}