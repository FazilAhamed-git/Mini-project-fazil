import React, { useEffect, useRef, useState } from "react";

function TimeOfDaySelect({ value, onChange, disabled, options: propOptions }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const ref = useRef(null);

  const defaultOptions = [
    { value: "Day", label: "Day", emoji: "☀️" },
    { value: "Night", label: "Night", emoji: "🌙" },
  ];

  const options = Array.isArray(propOptions) && propOptions.length ? propOptions : defaultOptions;

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setHighlight(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (open) {
      // set initial highlight to currently selected index
      const idx = options.findIndex((o) => o.value === value);
      setHighlight(idx >= 0 ? idx : 0);
    } else {
      setHighlight(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selected = options.find((o) => o.value === value) || options[0];

  const handleSelect = (v) => {
    if (disabled) return;
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight != null) handleSelect(options[highlight].value);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h == null ? 0 : Math.min(h + 1, options.length - 1)));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h == null ? options.length - 1 : Math.max(h - 1, 0)));
      return;
    }
  };

  return (
    <div className="time-select" ref={ref} onKeyDown={onKeyDown} tabIndex={0}>
      <button
        type="button"
        className="time-select-button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="time-emoji">{selected.emoji || ""}</span>
        <span className="time-label">{selected.label}</span>
        <span className="time-chevron">▾</span>
      </button>

      <div className={"time-options-wrapper " + (open ? "open" : "")}>
        <ul className="time-options" role="listbox">
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={"time-option " + (opt.value === value ? "selected" : "") + (highlight === idx ? " highlight" : "")}
              onClick={() => handleSelect(opt.value)}
              onMouseEnter={() => setHighlight(idx)}
              tabIndex={-1}
            >
              <span className="time-emoji">{opt.emoji || ""}</span>
              <span className="time-label">{opt.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TimeOfDaySelect;
