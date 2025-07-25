/*
Version 1.0.0 - AUTO SIDEBAR FLOW
Author - Mauro Carduz
*/

var d = Object.defineProperty;
var p = Object.getOwnPropertyDescriptor;
var c = Object.getOwnPropertyNames;
var f = Object.prototype.hasOwnProperty;
var u = (l, n) => { for (var i in n) d(l, i, { get: n[i], enumerable: !0 }) },
    b = (l, n, i, e) => {
        if (n && typeof n == "object" || typeof n == "function")
            for (let t of c(n)) !f.call(l, t) && t !== i && d(l, t, { get: () => n[t], enumerable: !(e = p(n, t)) || e.enumerable });
        return l
    };
var S = l => b(d({}, "__esModule", { value: !0 }), l);
var m = {};
u(m, { default: () => o });
module.exports = S(m);
var a = require("obsidian"),
    r = {
        leftSidebar: true,
        rightSidebar: true,
        syncLeftRight: false,
        enforceSameDelay: true,
        sidebarDelay: 3000,
        sidebarExpandDelay: 100,
        leftSideBarPixelTrigger: 10,
        rightSideBarPixelTrigger: 10,
        expandCollapseSpeed: 200,
        leftSidebarMaxWidth: 350,
        rightSidebarMaxWidth: 400,
        hideSidebarToggle: false,
        alwaysShowLeftRibbon: false
    },
    o = class extends a.Plugin {
        constructor() {
            super(...arguments);
            this.isHoveringLeft = false;
            this.isHoveringRight = false;
            this.collapseTimeoutLeft = null;
            this.collapseTimeoutRight = null;
            this.originalRibbonDisplay = '';

            // Throttle function to limit event frequency
            this.throttle = (fn, wait) => {
                let lastTime = 0;
                return function (...args) {
                    const now = Date.now();
                    if (now - lastTime >= wait) {
                        lastTime = now;
                        fn.apply(this, args);
                    }
                };
            };

            // Check if mouse is over search-related menus
            this.isMouseOverSearchMenu = (target) => {
                if (!target) return false;
                return !!target.closest(".prompt, .suggestion-container, .mod-search-suggestion, .search-input-container, .suggestion-item");
            };

            // Check if search menus are visible
            this.isSearchMenuActive = () => {
                return !!document.querySelector(".prompt:not([style*='display: none']), .suggestion-container:not([style*='display: none']), .mod-search-suggestion:not([style*='display: none'])");
            };

            // Schedule sidebar collapse with delay
            this.scheduleCollapse = (side, delay) => {
                const timeout = side === 'left' ? 'collapseTimeoutLeft' : 'collapseTimeoutRight';
                const isHovering = side === 'left' ? 'isHoveringLeft' : 'isHoveringRight';
                const collapseFn = side === 'left' ? this.collapseLeft.bind(this) : this.collapseRight.bind(this);
                
                if (this[timeout]) {
                    clearTimeout(this[timeout]);
                    this[timeout] = null;
                }
                this[timeout] = setTimeout(() => {
                    if (this.settings.syncLeftRight) {
                        // For sync mode, collapse only if neither sidebar is hovered
                        if (!this.isHoveringLeft && !this.isHoveringRight && !this.isSearchMenuActive()) {
                            this.collapseBoth();
                        }
                    } else if (!this[isHovering] && !this.isSearchMenuActive()) {
                        this.settings.syncLeftRight && this.settings.leftSidebar && this.settings.rightSidebar
                            ? this.collapseBoth()
                            : collapseFn();
                    }
                    this[timeout] = null;
                }, delay);
            };

            // Handle clicks outside sidebars
            this.documentClickHandler = (e) => {
                if (!this.leftSplit || !this.rightSplit) return;
                const target = e.target;
                if (!this.leftSplit.containerEl.contains(target) &&
                    !this.rightSplit.containerEl.contains(target) &&
                    !(this.leftRibbonEl && this.leftRibbonEl.contains(target)) &&
                    !this.isMouseOverSearchMenu(target) &&
                    !this.isSearchMenuActive()) {
                    if (!this.leftSplit.collapsed && this.settings.leftSidebar) this.collapseLeft();
                    if (!this.rightSplit.collapsed && this.settings.rightSidebar) this.collapseRight();
                }
            };

            // Get editor width for right sidebar trigger
            this.getEditorWidth = () => this.app.workspace.containerEl ? this.app.workspace.containerEl.clientWidth : window.innerWidth;

            // Handle mouse movement for sidebar hover
            this.mouseMoveHandler = (e) => {
                const x = e.clientX;
                const target = document.elementFromPoint(x, e.clientY);
                if (!target) return;

                // Left sidebar logic
                if (this.settings.leftSidebar && this.leftSplit) {
                    const wasHoveringLeft = this.isHoveringLeft;
                    this.isHoveringLeft = x <= this.settings.leftSideBarPixelTrigger ||
                                         this.leftSplit.containerEl.contains(target) ||
                                         (this.leftRibbonEl && this.leftRibbonEl.contains(target));
                    if (this.settings.syncLeftRight && this.isHoveringLeft) {
                        this.isHoveringRight = true; // Sync hover state
                    }
                    if (this.isHoveringLeft && this.leftSplit.collapsed) {
                        setTimeout(() => {
                            if (this.isHoveringLeft && this.leftSplit?.collapsed) {
                                this.settings.syncLeftRight ? this.expandBoth() : this.expandLeft();
                            }
                        }, this.settings.sidebarExpandDelay);
                    }
                    if (!this.isHoveringLeft && wasHoveringLeft && !this.leftSplit.collapsed && !this.isMouseOverSearchMenu(target) && !this.isSearchMenuActive()) {
                        this.scheduleCollapse('left', this.settings.sidebarDelay);
                    }
                }

                // Right sidebar logic
                if (this.settings.rightSidebar && this.rightSplit) {
                    const editorWidth = this.getEditorWidth();
                    const wasHoveringRight = this.isHoveringRight;
                    this.isHoveringRight = x >= editorWidth - this.settings.rightSideBarPixelTrigger ||
                                           this.rightSplit.containerEl.contains(target);
                    if (this.settings.syncLeftRight && this.isHoveringRight) {
                        this.isHoveringLeft = true; // Sync hover state
                    }
                    if (this.isHoveringRight && this.rightSplit.collapsed) {
                        setTimeout(() => {
                            if (this.isHoveringRight && this.rightSplit?.collapsed) {
                                this.settings.syncLeftRight ? this.expandBoth() : this.expandRight();
                            }
                        }, this.settings.sidebarExpandDelay);
                    }
                    if (!this.isHoveringRight && wasHoveringRight && !this.rightSplit.collapsed && !this.isMouseOverSearchMenu(target) && !this.isSearchMenuActive()) {
                        this.scheduleCollapse('right', this.settings.sidebarDelay);
                    }
                }
            };

            // Handle mouse leaving left sidebar
            this.leftSplitMouseLeaveHandler = (e) => {
                const relatedTarget = e.relatedTarget;
                if (!this.leftSplit?.containerEl.contains(relatedTarget) &&
                    !(this.leftRibbonEl && this.leftRibbonEl.contains(relatedTarget)) &&
                    !this.isMouseOverSearchMenu(relatedTarget) &&
                    !this.isSearchMenuActive()) {
                    this.isHoveringLeft = false;
                    this.leftSplit?.containerEl.removeClass("hovered");
                    this.scheduleCollapse('left', this.settings.sidebarDelay);
                }
            };

            // Handle mouse entering ribbon
            this.leftRibbonMouseEnterHandler = () => {
                if (this.settings.leftSidebar && this.leftSplit) {
                    this.isHoveringLeft = true;
                    setTimeout(() => {
                        if (this.isHoveringLeft && this.leftSplit?.collapsed) {
                            this.settings.syncLeftRight && this.settings.rightSidebar ? this.expandBoth() : this.expandLeft();
                        }
                    }, this.settings.sidebarExpandDelay);
                }
            };

            // Handle right toggle button click
            this.rightToggleClickHandler = (e) => {
                if (this.rightSplit && this.settings.rightSidebar) {
                    const editorWidth = this.getEditorWidth();
                    this.isHoveringRight = e.clientX >= editorWidth - this.settings.rightSideBarPixelTrigger;
                    if (this.rightSplit.collapsed) {
                        this.rightSplit.containerEl.removeClass("hovered");
                        if (this.collapseTimeoutRight) {
                            clearTimeout(this.collapseTimeoutRight);
                            this.collapseTimeoutRight = null;
                        }
                    } else if (!this.isHoveringRight) {
                        this.scheduleCollapse('right', this.settings.sidebarDelay);
                    }
                }
            };
        }

        async onload() {
            try {
                await this.loadSettings();
                document.body.classList.add("open-sidebar-hover-plugin");
                this.updateCSSVariables();

                this.app.workspace.onLayoutReady(() => {
                    this.leftSplit = this.app.workspace.leftSplit;
                    this.rightSplit = this.app.workspace.rightSplit;
                    this.leftRibbon = this.app.workspace.leftRibbon;
                    this.leftRibbonEl = document.querySelector('.workspace-ribbon.side-dock-ribbon.mod-left');
                    this.rightToggleButton = document.querySelector('.sidebar-toggle-button.mod-right');

                    if (!this.leftSplit || !this.rightSplit) {
                        console.warn("Auto Sidebar Flow: Workspace splits not found");
                        return;
                    }

                    // Register throttled mousemove event
                    document.addEventListener("mousemove", this.throttle(this.mouseMoveHandler.bind(this), 100));

                    // Right sidebar events
                    this.rightSplitMouseMoveHandler = () => this.rightSplit.containerEl.addClass("hovered");
                    this.rightSplit.containerEl.addEventListener("mousemove", this.rightSplitMouseMoveHandler);
                    this.rightSplit.containerEl.addEventListener("mouseleave", this.rightSplitMouseLeaveHandler);
                    this.rightSplitMouseEnterHandler = () => {
                        this.isHoveringRight = true;
                        this.rightSplit.containerEl.addClass("hovered");
                    };
                    this.rightSplit.containerEl.addEventListener("mouseenter", this.rightSplitMouseEnterHandler);

                    // Right toggle button click handler
                    if (this.rightToggleButton) {
                        this.rightToggleButton.addEventListener("click", this.rightToggleClickHandler);
                    }

                    // Left ribbon events
                    if (this.leftRibbon?.containerEl) {
                        this.leftRibbon.containerEl.addEventListener("mouseenter", this.leftRibbonMouseEnterHandler);
                    }

                    // Left sidebar events
                    this.leftSplitMouseMoveHandler = () => this.leftSplit.containerEl.addClass("hovered");
                    this.leftSplit.containerEl.addEventListener("mousemove", this.leftSplitMouseMoveHandler);
                    this.leftSplit.containerEl.addEventListener("mouseleave", this.leftSplitMouseLeaveHandler);
                    this.leftSplitMouseEnterHandler = () => {
                        this.isHoveringLeft = true;
                        this.leftSplit.containerEl.addClass("hovered");
                    };
                    this.leftSplit.containerEl.addEventListener("mouseenter", this.leftSplitMouseEnterHandler);

                    // Document click handler
                    document.addEventListener("click", this.documentClickHandler);

                    // Ribbon setup
                    if (this.leftRibbonEl) {
                        this.originalRibbonDisplay = this.leftRibbonEl.style.display;
                        if (!this.settings.alwaysShowLeftRibbon) {
                            this.leftRibbonEl.style.display = 'none';
                        }
                        this.leftRibbonEl.addEventListener("mouseenter", () => {
                            this.isHoveringLeft = true;
                        });
                        this.leftRibbonEl.addEventListener("mouseleave", () => {
                            this.isHoveringLeft = false;
                            this.scheduleCollapse('left', this.settings.sidebarDelay);
                        });
                    }

                    // Observe left sidebar state changes
                    if (this.leftSplit && this.leftRibbonEl) {
                        this.leftSplitObserver = new MutationObserver(() => {
                            if (this.leftSplit.collapsed) {
                                this.collapseLeft();
                            } else {
                                this.expandLeft();
                            }
                        });
                        this.leftSplitObserver.observe(this.leftSplit.containerEl, { attributes: true, attributeFilter: ['class'] });
                    }
                });

                this.addSettingTab(new g(this.app, this));
            } catch (error) {
                console.error("Auto Sidebar Flow: Failed to load plugin", error);
            }
        }

        onunload() {
            try {
                this.saveSettings();
                document.body.classList.remove("open-sidebar-hover-plugin");
                document.removeEventListener("mousemove", this.mouseMoveHandler);
                document.removeEventListener("click", this.documentClickHandler);

                if (this.rightSplit?.containerEl) {
                    this.rightSplit.containerEl.removeEventListener("mouseleave", this.rightSplitMouseLeaveHandler);
                    this.rightSplit.containerEl.removeEventListener("mouseenter", this.rightSplitMouseEnterHandler);
                    this.rightSplit.containerEl.removeEventListener("mousemove", this.rightSplitMouseMoveHandler);
                }

                if (this.rightToggleButton) {
                    this.rightToggleButton.removeEventListener("click", this.rightToggleClickHandler);
                }

                if (this.leftRibbon?.containerEl) {
                    this.leftRibbon.containerEl.removeEventListener("mouseenter", this.leftRibbonMouseEnterHandler);
                }

                if (this.leftSplit?.containerEl) {
                    this.leftSplit.containerEl.removeEventListener("mouseleave", this.leftSplitMouseLeaveHandler);
                    this.leftSplit.containerEl.removeEventListener("mouseenter", this.leftSplitMouseEnterHandler);
                    this.leftSplit.containerEl.removeEventListener("mousemove", this.leftSplitMouseMoveHandler);
                }

                if (this.leftRibbonEl) {
                    this.leftRibbonEl.style.display = this.originalRibbonDisplay || '';
                    this.leftRibbonEl.removeEventListener("mouseenter", () => {
                        this.isHoveringLeft = true;
                    });
                    this.leftRibbonEl.removeEventListener("mouseleave", () => {
                        this.isHoveringLeft = false;
                        this.scheduleCollapse('left', this.settings.sidebarDelay);
                    });
                }

                if (this.leftSplitObserver) {
                    this.leftSplitObserver.disconnect();
                }

                // Remove the custom style element to clean up
                const styleEl = document.getElementById("auto-sidebar-flow");
                if (styleEl) {
                    styleEl.remove();
                }
            } catch (error) {
                console.error("Auto Sidebar Flow: Error during unload", error);
            }
        }

        async loadSettings() {
            try {
                const loadedSettings = await this.loadData() || {};
                this.settings = Object.assign({}, r, loadedSettings);
                this.settings.sidebarDelay = isNaN(Number(this.settings.sidebarDelay)) ? r.sidebarDelay : Math.max(1000, Number(this.settings.sidebarDelay));
                this.settings.sidebarExpandDelay = Math.max(0, Number(this.settings.sidebarExpandDelay) || r.sidebarExpandDelay);
                this.settings.leftSideBarPixelTrigger = Math.max(1, Number(this.settings.leftSideBarPixelTrigger) || r.leftSideBarPixelTrigger);
                this.settings.rightSideBarPixelTrigger = Math.max(1, Number(this.settings.rightSideBarPixelTrigger) || r.rightSideBarPixelTrigger);
                this.settings.leftSidebarMaxWidth = Math.max(100, Number(this.settings.leftSidebarMaxWidth) || r.leftSidebarMaxWidth);
                this.settings.rightSidebarMaxWidth = Math.max(100, Number(this.settings.rightSidebarMaxWidth) || r.rightSidebarMaxWidth);
                this.settings.expandCollapseSpeed = Math.max(0, Number(this.settings.expandCollapseSpeed) || r.expandCollapseSpeed);
                this.settings.hideSidebarToggle = !!this.settings.hideSidebarToggle;
                this.settings.alwaysShowLeftRibbon = !!this.settings.alwaysShowLeftRibbon;
                await this.saveSettings();
            } catch (error) {
                console.error("Auto Sidebar Flow: Failed to load settings", error);
                this.settings = Object.assign({}, r);
            }
        }

        async saveSettings() {
            try {
                await this.saveData(this.settings);
            } catch (error) {
                console.error("Auto Sidebar Flow: Failed to save settings", error);
            }
        }

        updateCSSVariables() {
            const styleId = "auto-sidebar-flow";
            // Remove existing style element if it exists to prevent duplication
            let styleEl = document.getElementById(styleId);
            if (styleEl) {
                styleEl.remove();
            }
            // Create a new style element
            styleEl = document.createElement("style");
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
            // Apply CSS rules based on plugin settings
            styleEl.textContent = `
                :root {
                    --sidebar-expand-collapse-speed: ${this.settings.expandCollapseSpeed}ms;
                    --sidebar-expand-delay: ${this.settings.sidebarExpandDelay}ms;
                    --left-sidebar-max-width: ${this.settings.leftSidebarMaxWidth}px;
                    --right-sidebar-max-width: ${this.settings.rightSidebarMaxWidth}px;
                }
                body {
                    --sidebar-width: ${this.settings.leftSidebarMaxWidth}px !important;
                    --right-sidebar-width: ${this.settings.rightSidebarMaxWidth}px !important;
                }
                .sidebar-toggle-button.mod-right {
                    display: ${this.settings.hideSidebarToggle ? 'none' : ''};
                }
                .sidebar-toggle-button.mod-left {
                    display: ${this.settings.hideSidebarToggle ? 'none' : ''};
                }
                .workspace-tabs.mod-top-left-space .workspace-tab-header-container {
                    ${this.settings.alwaysShowLeftRibbon || this.settings.hideSidebarToggle ? '' : 'padding-left: 88px !important;'}
                }
                .mod-left-split .workspace-tab-header-container-inner {
                    ${this.settings.alwaysShowLeftRibbon || this.settings.hideSidebarToggle ? '' : 'margin-left: -44px !important;'}
                }
                ${this.settings.hideSidebarToggle ? `
                .workspace-tabs.mod-top-right-space .workspace-tab-header-container {
                    padding-right: 10px !important;
                }
                .workspace-tabs.mod-top-left-space .workspace-tab-header-container {
                    ${this.settings.alwaysShowLeftRibbon ? '' : 'padding-left: 88px !important;'}
                }
                .mod-left-split .workspace-tab-header-container-inner {
                    ${this.settings.alwaysShowLeftRibbon ? '' : 'margin-left: -44px !important;'}
                }
                ` : ''}
                ${this.settings.alwaysShowLeftRibbon ? '' : `
                .workspace-ribbon.side-dock-ribbon.mod-left {
                    display: none;
                }`}
            `;
        }

        expandRight() {
            if (this.rightSplit) {
                this.rightSplit.expand();
                this.isHoveringRight = true;
                if (this.collapseTimeoutRight) {
                    clearTimeout(this.collapseTimeoutRight);
                    this.collapseTimeoutRight = null;
                }
            }
        }

        expandLeft() {
            if (this.leftSplit) {
                this.leftSplit.expand();
                this.isHoveringLeft = true;
                if (this.leftRibbonEl && !this.settings.alwaysShowLeftRibbon) {
                    this.leftRibbonEl.style.display = 'block';
                }
                if (this.collapseTimeoutLeft) {
                    clearTimeout(this.collapseTimeoutLeft);
                    this.collapseTimeoutLeft = null;
                }
            }
        }

        expandBoth() {
            this.expandRight();
            this.expandLeft();
        }

        collapseRight() {
            if (this.rightSplit) {
                this.rightSplit.collapse();
                this.isHoveringRight = false;
                if (this.collapseTimeoutRight) {
                    clearTimeout(this.collapseTimeoutRight);
                    this.collapseTimeoutRight = null;
                }
            }
        }

        collapseLeft() {
            if (this.leftSplit) {
                this.leftSplit.collapse();
                this.isHoveringLeft = false;
                if (this.leftRibbonEl && !this.settings.alwaysShowLeftRibbon) {
                    this.leftRibbonEl.style.display = 'none';
                }
                if (this.collapseTimeoutLeft) {
                    clearTimeout(this.collapseTimeoutLeft);
                    this.collapseTimeoutLeft = null;
                }
            }
        }

        collapseBoth() {
            this.collapseRight();
            this.collapseLeft();
        }
    },
g = class extends a.PluginSettingTab {
    constructor(i, e) { super(i, e); this.plugin = e }
    display() {
        const { containerEl } = this;
        containerEl.empty();

        new a.Setting(containerEl)
            .setName("Enable Left Sidebar")
            .setDesc("Open the left sidebar by hovering near the left edge.")
            .addToggle(e => e.setValue(this.plugin.settings.leftSidebar).onChange(async t => {
                this.plugin.settings.leftSidebar = t;
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Enable Right Sidebar")
            .setDesc("Open the right sidebar by hovering near the right edge.")
            .addToggle(e => e.setValue(this.plugin.settings.rightSidebar).onChange(async t => {
                this.plugin.settings.rightSidebar = t;
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Sync Sidebars")
            .setDesc("Hovering one sidebar opens both (requires both sidebars enabled).")
            .addToggle(e => e.setValue(this.plugin.settings.syncLeftRight).onChange(async t => {
                this.plugin.settings.syncLeftRight = t;
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Hide Toggle Buttons")
            .setDesc("Hide the buttons for manually opening/closing sidebars.")
            .addToggle(e => e.setValue(this.plugin.settings.hideSidebarToggle).onChange(async t => {
                this.plugin.settings.hideSidebarToggle = t;
                this.plugin.updateCSSVariables();
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Keep Ribbon Visible")
            .setDesc("Keep the left toolbar visible or hide it with the sidebar.")
            .addToggle(e => e.setValue(this.plugin.settings.alwaysShowLeftRibbon).onChange(async t => {
                this.plugin.settings.alwaysShowLeftRibbon = t;
                this.plugin.updateCSSVariables();
                if (this.plugin.leftRibbonEl) {
                    if (t) {
                        this.plugin.leftRibbonEl.style.display = this.plugin.originalRibbonDisplay || '';
                    } else {
                        this.plugin.leftRibbonEl.style.display = this.plugin.leftSplit.collapsed ? 'none' : 'block';
                    }
                }
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl).setName("Hover Behavior").setHeading();

        new a.Setting(containerEl)
            .setName("Left Hover Distance")
            .setDesc("Pixels from the left edge to open the sidebar (minimum 1).")
            .addText(e => e.setPlaceholder("10").setValue(this.plugin.settings.leftSideBarPixelTrigger.toString()).onChange(async t => {
                const s = Number(t);
                this.plugin.settings.leftSideBarPixelTrigger = (!t || isNaN(s) || s < 1) ? r.leftSideBarPixelTrigger : s;
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Right Hover Distance")
            .setDesc("Pixels from the right edge to open the sidebar (minimum 1).")
            .addText(e => e.setPlaceholder("10").setValue(this.plugin.settings.rightSideBarPixelTrigger.toString()).onChange(async t => {
                const s = Number(t);
                this.plugin.settings.rightSideBarPixelTrigger = (!t || isNaN(s) || s < 1) ? r.rightSideBarPixelTrigger : s;
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl).setName("Animation Timing").setHeading();

        new a.Setting(containerEl)
            .setName("Collapse Delay")
            .setDesc("Milliseconds before the sidebar closes after the mouse leaves (minimum 1000).")
            .addText(e => e.setPlaceholder("3000").setValue(this.plugin.settings.sidebarDelay.toString()).onChange(async t => {
                const s = Number(t);
                this.plugin.settings.sidebarDelay = (!t || isNaN(s) || s < 0) ? r.sidebarDelay : s;
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Expand Delay")
            .setDesc("Milliseconds before the sidebar opens when hovering.")
            .addText(e => e.setPlaceholder("100").setValue(this.plugin.settings.sidebarExpandDelay.toString()).onChange(async t => {
                const s = Number(t);
                this.plugin.settings.sidebarExpandDelay = (!t || isNaN(s) || s < 0) ? r.sidebarExpandDelay : s;
                this.plugin.updateCSSVariables();
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Animation Speed")
            .setDesc("Speed of the sidebar open/close animation in milliseconds (0 to disable animation).")
            .addText(e => e.setPlaceholder("200").setValue(this.plugin.settings.expandCollapseSpeed.toString()).onChange(async s => {
                const h = Number(s);
                this.plugin.settings.expandCollapseSpeed = (!s || isNaN(h) || h < 0) ? r.expandCollapseSpeed : h;
                this.plugin.updateCSSVariables();
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl).setName("Sidebar Size").setHeading();

        new a.Setting(containerEl)
            .setName("Left Sidebar Width")
            .setDesc("Maximum width in pixels for the left sidebar when open.")
            .addText(e => e.setPlaceholder("350").setValue(this.plugin.settings.leftSidebarMaxWidth.toString()).onChange(async t => {
                const s = Number(t);
                this.plugin.settings.leftSidebarMaxWidth = (!t || isNaN(s) || s < 100) ? r.leftSidebarMaxWidth : s;
                this.plugin.updateCSSVariables();
                await this.plugin.saveSettings();
            }));

        new a.Setting(containerEl)
            .setName("Right Sidebar Width")
            .setDesc("Maximum width in pixels for the right sidebar when open.")
            .addText(e => e.setPlaceholder("400").setValue(this.plugin.settings.rightSidebarMaxWidth.toString()).onChange(async t => {
                const s = Number(t);
                this.plugin.settings.rightSidebarMaxWidth = (!t || isNaN(s) || s < 100) ? r.rightSidebarMaxWidth : s;
                this.plugin.updateCSSVariables();
                await this.saveSettings();
            }));
    }
};
