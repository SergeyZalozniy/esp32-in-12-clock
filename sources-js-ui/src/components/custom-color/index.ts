import "./custom-color.scss";
import infoIcon from "@assets/info-icon.svg";
import { translations } from "@utils/translate";
import { getLanguage } from "@utils/getLanguage.ts";
import { websocketService } from "@services/websocket";
import { WebSocketCommand } from "@services/websocketCommands";

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

const render = (
  containerElement: HTMLElement,
  color: string,
  mode: "basic" | "manual"
) => {
  const lang = getLanguage();
  const title = translations["backlight-color"]?.[lang] || "Backlight Color";
  const description =
    translations["backlight-color-desc"]?.[lang] ||
    "Choose the color for the RGB backlight";
  const selectLabel = translations["select-color"]?.[lang] || "Select Color";
  const basicText = translations["basic"]?.[lang] || "Basic";
  const manualText = translations["manual"]?.[lang] || "Manual";
  const standardOrangeText =
    translations["standard-orange"]?.[lang] || "Standard Orange";
  const setColorText = translations["set-color"]?.[lang] || "Set Color";


  // BACKLIGHT COLOR COMMENTED OUT BECAUSE IT'S NOT USED
  containerElement.innerHTML = `
    <-- <div class="settings-section">
      <h3 class="settings-section__title flex items-center gap-8" data-i18n="backlight-color">
        <img src="${infoIcon}" alt="${title}" class="settings-section__icon" width="20" height="20">
        ${title}
      </h3>
      <p class="settings-section__description" data-i18n="backlight-color-desc">
        ${description}
      </p>

      <div class="custom-color">
        <div class="custom-color__toggle flex gap-8">
          <button class="custom-color__toggle-btn flex-1 ${mode === "basic" ? "custom-color__toggle-btn--active" : ""}" data-mode="basic" data-i18n="basic">
            ${basicText}
          </button>
          <button class="custom-color__toggle-btn flex-1 ${mode === "manual" ? "custom-color__toggle-btn--active" : ""}" data-mode="manual" data-i18n="manual">
            ${manualText}
          </button>
        </div>

        <div class="custom-color__basic ${mode === "basic" ? "custom-color__basic--active" : ""}">
          <div class="custom-color__basic-info">
            <div class="custom-color__preview" style="background-color: ${color}"></div>
            <div class="custom-color__info">
              <span class="custom-color__label-text">${standardOrangeText}</span>
              <span class="custom-color__hex">${color.toUpperCase()}</span>
              <span class="custom-color__rgb" id="backlight-color-rgb-basic"></span>
            </div>
          </div>
        </div>

        <div class="custom-color__manual ${mode === "manual" ? "custom-color__manual--active" : ""}">
          <div class="custom-color__picker-wrapper">
            <label class="custom-color__label" data-i18n="select-color">
              ${selectLabel}
            </label>
            <div class="custom-color__picker-container">
              <input
                type="color"
                class="custom-color__picker"
                id="backlight-color-picker"
                value="${color}"
              >
              <div class="custom-color__info">
                <span class="custom-color__hex">${color.toUpperCase()}</span>
                <span class="custom-color__rgb" id="backlight-color-rgb"></span>
              </div>
            </div>
          </div>
        </div>

        <button class="custom-color__button" id="backlight-color-submit" data-i18n="set-color">
          ${setColorText}
        </button>
      </div>
    </div> -->
  `;

  // Update RGB display
  const rgbElement = containerElement.querySelector(
    "#backlight-color-rgb"
  ) as HTMLElement;
  const rgbElementBasic = containerElement.querySelector(
    "#backlight-color-rgb-basic"
  ) as HTMLElement;
  const rgb = hexToRgb(color);
  if (rgbElement && rgb) {
    rgbElement.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
  if (rgbElementBasic && rgb) {
    rgbElementBasic.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
};

export const initCustomColor = (containerElement: HTMLElement): void => {
  // Standard orange color (primary color)
  const STANDARD_ORANGE = "#FF6B35";
  let currentColor = STANDARD_ORANGE;
  let currentMode: "basic" | "manual" = "basic";

  render(containerElement, currentColor, currentMode);

  const saveColor = (color: string) => {
    const rgb = hexToRgb(color);
    if (rgb) {
      // Send as "R|G|B" format
      const colorString = `${rgb.r}|${rgb.g}|${rgb.b}`;
      console.log("Backlight color saved:", colorString);
      websocketService.send(WebSocketCommand.BACKLIGHT_COLOR, colorString);
    }
  };

  const switchMode = (mode: "basic" | "manual") => {
    currentMode = mode;

    // Update button states
    const toggleButtons = containerElement.querySelectorAll(
      ".custom-color__toggle-btn"
    );
    toggleButtons.forEach((button) => {
      const btnMode = button.getAttribute("data-mode");
      if (btnMode === mode) {
        button.classList.add("custom-color__toggle-btn--active");
      } else {
        button.classList.remove("custom-color__toggle-btn--active");
      }
    });

    // Update visibility
    const basicDiv = containerElement.querySelector(
      ".custom-color__basic"
    ) as HTMLElement;
    const manualDiv = containerElement.querySelector(
      ".custom-color__manual"
    ) as HTMLElement;

    if (basicDiv && manualDiv) {
      if (mode === "basic") {
        basicDiv.classList.add("custom-color__basic--active");
        manualDiv.classList.remove("custom-color__manual--active");
        // Set to standard orange when switching to basic
        currentColor = STANDARD_ORANGE;
        updateColorDisplay(currentColor);
      } else {
        basicDiv.classList.remove("custom-color__basic--active");
        manualDiv.classList.add("custom-color__manual--active");
      }
    }
  };

  const updateColorDisplay = (color: string) => {
    currentColor = color;
    const previews = containerElement.querySelectorAll(
      ".custom-color__preview"
    );
    const hexDisplays = containerElement.querySelectorAll(".custom-color__hex");
    const rgbDisplay = containerElement.querySelector(
      "#backlight-color-rgb"
    ) as HTMLElement;
    const rgbDisplayBasic = containerElement.querySelector(
      "#backlight-color-rgb-basic"
    ) as HTMLElement;

    previews.forEach((preview) => {
      (preview as HTMLElement).style.backgroundColor = color;
    });

    hexDisplays.forEach((hexDisplay) => {
      (hexDisplay as HTMLElement).textContent = color.toUpperCase();
    });

    const rgb = hexToRgb(color);
    if (rgbDisplay && rgb) {
      rgbDisplay.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    if (rgbDisplayBasic && rgb) {
      rgbDisplayBasic.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
  };

  // Initialize mode toggle buttons
  const toggleButtons = containerElement.querySelectorAll(
    ".custom-color__toggle-btn"
  );
  toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const mode = target.getAttribute("data-mode") as "basic" | "manual";
      switchMode(mode);
    });
  });

  // Color picker handler
  const colorPicker = containerElement.querySelector(
    "#backlight-color-picker"
  ) as HTMLInputElement;
  if (colorPicker) {
    colorPicker.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const newColor = target.value;
      updateColorDisplay(newColor);
    });
  }

  // Submit button handler
  const submitButton = containerElement.querySelector(
    "#backlight-color-submit"
  ) as HTMLButtonElement;
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      saveColor(currentColor);
    });
  }

  // Listen for color updates from device
  websocketService.onMessage(
    WebSocketCommand.BACKLIGHT_COLOR,
    (data: string) => {
      const parts = data.split("|").map((p) => parseInt(p.trim(), 10));
      if (
        parts.length === 3 &&
        parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)
      ) {
        const [r, g, b] = parts;
        const hexColor = rgbToHex(r, g, b);
        currentColor = hexColor;
        if (colorPicker) {
          colorPicker.value = hexColor;
        }
        updateColorDisplay(hexColor);
      }
    }
  );

  // Update translations when language changes
  window.addEventListener("languageChanged", () => {
    render(containerElement, currentColor, currentMode);

    // Re-attach event listeners
    const newToggleButtons = containerElement.querySelectorAll(
      ".custom-color__toggle-btn"
    );
    newToggleButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const mode = target.getAttribute("data-mode") as "basic" | "manual";
        switchMode(mode);
      });
    });

    const newColorPicker = containerElement.querySelector(
      "#backlight-color-picker"
    ) as HTMLInputElement;
    if (newColorPicker) {
      newColorPicker.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const newColor = target.value;
        updateColorDisplay(newColor);
      });
    }

    const newSubmitButton = containerElement.querySelector(
      "#backlight-color-submit"
    ) as HTMLButtonElement;
    if (newSubmitButton) {
      newSubmitButton.addEventListener("click", () => {
        saveColor(currentColor);
      });
    }
  });
};
