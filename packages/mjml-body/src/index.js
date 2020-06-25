import { BodyComponent, suffixCssClasses } from 'mjml-core'

export default class MjBody extends BodyComponent {
  static allowedAttributes = {
    width: 'unit(px)',
    'wrapper-class': 'string',
    'background-color': 'color',
    'background-url': 'string',
    'background-repeat': 'enum(repeat,no-repeat)',
    'background-size': 'string',
    'background-position': 'string',
    'background-position-x': 'string',
    'background-position-y': 'string',
    border: 'string',
    'border-bottom': 'string',
    'border-left': 'string',
    'border-radius': 'string',
    'border-right': 'string',
    'border-top': 'string',
    direction: 'enum(ltr,rtl)',
    'full-width': 'enum(full-width)',
    padding: 'unit(px,%){1,4}',
    'padding-top': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'text-align': 'enum(left,center,right)',
    'text-padding': 'unit(px,%){1,4}',
  }

  static defaultAttributes = {
    'background-repeat': 'repeat',
    'background-size': 'auto',
    'background-position': 'top center',
    direction: 'ltr',
    width: '600px',
    padding: '20px 0',
    'text-align': 'center',
    'text-padding': '4px 4px 4px 0',
  }

  getChildContext() {
    return {
      ...this.context,
      containerWidth: this.getAttribute('width'),
    }
  }

  isFullWidth() {
    return this.getAttribute('full-width') === 'full-width'
  }

  getStyles() {
    const { containerWidth } = this.context

    const fullWidth = this.isFullWidth()

    const background = this.getAttribute('background-url')
      ? {
          background: this.getBackground(),
          // background size, repeat and position has to be seperate since yahoo does not support shorthand background css property
          'background-position': this.getBackgroundString(),
          'background-repeat': this.getAttribute('background-repeat'),
          'background-size': this.getAttribute('background-size'),
        }
      : {
          background: this.getAttribute('background-color'),
          'background-color': this.getAttribute('background-color'),
        }

    return {
      tableFullwidth: {
        ...(fullWidth ? background : {}),
        width: '100%',
        'border-radius': this.getAttribute('border-radius'),
      },
      table: {
        ...(fullWidth ? {} : background),
        width: '100%',
        'border-radius': this.getAttribute('border-radius'),
      },
      td: {
        border: this.getAttribute('border'),
        'border-bottom': this.getAttribute('border-bottom'),
        'border-left': this.getAttribute('border-left'),
        'border-right': this.getAttribute('border-right'),
        'border-top': this.getAttribute('border-top'),
        direction: this.getAttribute('direction'),
        'font-size': '0px',
        padding: this.getAttribute('padding'),
        'padding-bottom': this.getAttribute('padding-bottom'),
        'padding-left': this.getAttribute('padding-left'),
        'padding-right': this.getAttribute('padding-right'),
        'padding-top': this.getAttribute('padding-top'),
        'text-align': this.getAttribute('text-align'),
      },
      div: {
        ...(fullWidth ? {} : background),
        margin: '0px auto',
        'border-radius': this.getAttribute('border-radius'),
        'max-width': containerWidth,
      },
      innerDiv: {
        'line-height': '0',
        'font-size': '0',
      },
    }
  }

  renderWrappedChildren() {
    const { children } = this.props
    const { containerWidth } = this.context

    return `
      ${this.renderChildren(children, {
        renderer: (component) =>
          component.constructor.isRawElement()
            ? component.render()
            : `
          <!--[if mso | IE]>
            <tr>
              <td
                ${component.htmlAttributes({
                  align: component.getAttribute('align'),
                  class: suffixCssClasses(
                    component.getAttribute('css-class'),
                    'outlook',
                  ),
                  width: containerWidth,
                })}
              >
          <![endif]-->
            ${component.render()}
          <!--[if mso | IE]>
              </td>
            </tr>
          <![endif]-->
        `,
      })}
    `
  }

  renderSection() {
    return `
      <div ${this.htmlAttributes({
        class: this.getAttribute('css-class'),
        style: 'div',
      })}>
        <table
          ${this.htmlAttributes({
            align: 'center',
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            style: 'table',
          })}
        >
          <tbody>
            <tr>
              <td
                ${this.htmlAttributes({
                  style: 'td',
                  class: this.getAttribute('wrapper-class'),
                })}
              >
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <![endif]-->
                  ${this.renderWrappedChildren()}
                <!--[if mso | IE]>
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }

  renderBefore() {
    const { containerWidth } = this.context

    return `
      <!--[if mso | IE]>
      <table
        ${this.htmlAttributes({
          align: 'center',
          border: '0',
          cellpadding: '0',
          cellspacing: '0',
          class: suffixCssClasses(this.getAttribute('css-class'), 'outlook'),
          style: { width: `${containerWidth}` },
          width: parseInt(containerWidth, 10),
        })}
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    `
  }

  // eslint-disable-next-line class-methods-use-this
  renderAfter() {
    return `
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    `
  }

  render() {
    const { setBackgroundColor } = this.context
    setBackgroundColor(this.getAttribute('background-color'))

    return `
 
          ${this.renderBefore()}
          ${this.renderSection()}
          ${this.renderAfter()}

    `
  }
}
