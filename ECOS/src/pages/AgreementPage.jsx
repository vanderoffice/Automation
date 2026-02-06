import { useState } from 'react'
import {
  TextInput,
  TextArea,
  Checkbox,
  Select,
  Button,
  Card,
  Badge,
  SectionHeader,
  Alert,
} from '../components/ui'

export default function AgreementPage() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [checked1, setChecked1] = useState(true)
  const [checked2, setChecked2] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [showAlerts, setShowAlerts] = useState({
    info: true,
    success: true,
    warning: true,
    error: true,
  })

  const selectOptions = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
  ]

  return (
    <div className="animate-in space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Component Preview
        </h1>
        <p className="text-neutral-400 mb-8">
          Design system showcase — all UI components rendered below.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BUTTONS                                                            */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Buttons"
        description="Four variants in three sizes"
      />

      <Card title="Button Variants">
        <div className="space-y-6">
          {['sm', 'md', 'lg'].map((size) => (
            <div key={size}>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
                Size: {size}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size={size}>
                  Primary
                </Button>
                <Button variant="secondary" size={size}>
                  Secondary
                </Button>
                <Button variant="danger" size={size}>
                  Danger
                </Button>
                <Button variant="ghost" size={size}>
                  Ghost
                </Button>
                <Button variant="primary" size={size} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* CARDS                                                              */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Cards"
        description="With and without titles, padding control"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Card with Title">
          <p className="text-neutral-400 text-sm">
            This card has a title header with a bottom border separator.
          </p>
        </Card>

        <Card>
          <p className="text-neutral-400 text-sm">
            This card has no title — just content inside.
          </p>
        </Card>

        <Card title="No Padding Content" padding={false}>
          <div className="bg-neutral-900 p-4">
            <p className="text-neutral-400 text-sm">
              Content area with padding=false. Useful for tables or custom
              layouts.
            </p>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BADGES                                                             */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader title="Badges" description="Five semantic variants" />

      <Card>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* TEXT INPUTS                                                        */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Text Inputs"
        description="Normal, error, and disabled states"
      />

      <Card>
        <div className="space-y-4">
          <TextInput
            label="Normal Input"
            name="normal-input"
            placeholder="Enter something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <TextInput
            label="Required Input"
            name="required-input"
            placeholder="This field is required"
            required
            value=""
            onChange={() => {}}
          />
          <TextInput
            label="Input with Error"
            name="error-input"
            placeholder="Something went wrong"
            value="bad data"
            onChange={() => {}}
            error="This field contains an invalid value."
          />
          <TextInput
            label="Disabled Input"
            name="disabled-input"
            placeholder="Cannot edit"
            value="Read-only value"
            onChange={() => {}}
            disabled
          />
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* TEXTAREA                                                           */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader title="TextArea" description="Multi-line text input" />

      <Card>
        <TextArea
          label="Description"
          name="description"
          placeholder="Enter a detailed description..."
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          rows={4}
        />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* CHECKBOXES                                                         */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Checkboxes"
        description="Checked, unchecked, and with description"
      />

      <Card>
        <div className="space-y-4">
          <Checkbox
            label="Checked checkbox"
            name="check-1"
            checked={checked1}
            onChange={(e) => setChecked1(e.target.checked)}
          />
          <Checkbox
            label="Unchecked checkbox"
            name="check-2"
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
          />
          <Checkbox
            label="With description"
            name="check-3"
            checked={false}
            onChange={() => {}}
            description="This checkbox includes a description line beneath the label."
          />
          <Checkbox
            label="Disabled checkbox"
            name="check-4"
            checked={true}
            onChange={() => {}}
            disabled
          />
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* SELECT                                                             */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Select"
        description="Native dropdown with custom arrow"
      />

      <Card>
        <div className="space-y-4">
          <Select
            label="Property Type"
            name="property-type"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={selectOptions}
            placeholder="Choose a type..."
          />
          <Select
            label="Disabled Select"
            name="disabled-select"
            value="commercial"
            onChange={() => {}}
            options={selectOptions}
            disabled
          />
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION HEADERS                                                    */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Section Headers"
        description="With and without an action slot"
      />

      <Card>
        <div className="space-y-6">
          <SectionHeader
            title="Without Action"
            description="Just a title and description"
          />
          <SectionHeader
            title="With Action"
            description="Includes a button on the right"
            action={
              <Button variant="secondary" size="sm">
                Add New
              </Button>
            }
          />
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* ALERTS                                                             */}
      {/* ------------------------------------------------------------------ */}
      <SectionHeader
        title="Alerts"
        description="Four variants with optional dismiss"
      />

      <div className="space-y-4">
        {showAlerts.info && (
          <Alert
            variant="info"
            title="Information"
            dismissible
            onDismiss={() =>
              setShowAlerts((s) => ({ ...s, info: false }))
            }
          >
            This is an informational alert. Click the X to dismiss.
          </Alert>
        )}
        {showAlerts.success && (
          <Alert
            variant="success"
            title="Success"
            dismissible
            onDismiss={() =>
              setShowAlerts((s) => ({ ...s, success: false }))
            }
          >
            Operation completed successfully.
          </Alert>
        )}
        {showAlerts.warning && (
          <Alert variant="warning" title="Warning">
            This is a warning alert without a dismiss button.
          </Alert>
        )}
        {showAlerts.error && (
          <Alert variant="error" title="Error">
            Something went wrong. Please try again.
          </Alert>
        )}
      </div>
    </div>
  )
}
