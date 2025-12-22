# App Store Screenshots

This folder contains all screenshots required for App Store submission.

## Requirements

### iPhone Screenshots (6.9" Display)
- **Resolution**: 1284 × 2778 pixels
- **Format**: PNG
- **Quantity**: 5 screenshots minimum
- **Location**: `iphone/` folder

Required screenshots:
1. Main calculator view (light theme)
2. Calculator with expression/calculation
3. Currency selector view
4. Settings/language selection
5. Dark mode view

### iPad Screenshots (12.9" Display)
- **Resolution**: 2048 × 2732 pixels
- **Format**: PNG
- **Quantity**: 3 screenshots minimum
- **Location**: `ipad/` folder

Required screenshots:
1. Main view (light theme)
2. Dark mode view
3. Currency picker

## How to Create Screenshots

### Option 1: Using Simulator (Current Method)

For iPhone:
```bash
cd /path/to/project
./make-screenshots.sh
```

For iPad:
```bash
cd /path/to/project
./make-ipad-screenshots.sh
```

### Option 2: Manual Capture

1. Launch iOS Simulator
2. Open the app
3. Navigate to desired screen
4. Press `Cmd + S` to save screenshot
5. Resize using the provided script:
```bash
./resize-screenshot.sh
```

## Naming Convention

- `01-calculator-main.png`
- `02-calculator-expression.png`
- `03-currency-selector.png`
- `04-settings.png`
- `05-dark-mode.png`

## Marketing Screenshots (Optional)

For better App Store presentation, you can create marketing screenshots with:
- Device frames
- Gradient backgrounds
- Promotional text
- App features highlights

Use Figma templates or tools like:
- [AppLaunchpad](https://theapplaunchpad.com/)
- [Previewed](https://previewed.app/)
- [Shotsnapp](https://shotsnapp.com/)

## Current Status

- [ ] iPhone screenshots (5 required)
- [ ] iPad screenshots (3 required)
- [ ] Marketing screenshots (optional)

## Notes

- Screenshots must show actual app content (no mockups)
- Avoid showing notification bars or system UI
- Ensure text is readable
- Use consistent theme across screenshots
- Test on actual devices before submission
