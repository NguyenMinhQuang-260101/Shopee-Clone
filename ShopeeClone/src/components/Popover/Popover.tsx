import { arrow, FloatingArrow, FloatingPortal, shift, useFloating } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: React.ElementType
  initialIsOpen?: boolean
}

export default function Popover({ children, className, renderPopover, as: Element = 'div', initialIsOpen }: Props) {
  const [isOpen, setIsOpen] = useState(initialIsOpen || false)
  const arrowRef = React.useRef<SVGSVGElement>(null)
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    middleware: [shift(), arrow({ element: arrowRef })]
  })
  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }

  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <div ref={refs.setFloating} style={floatingStyles}>
              <motion.div
                className='bg-white relative shadow-md rounded-sm border border-gray-200'
                initial={{ opacity: 0, transform: 'scale(0)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0)' }}
                transition={{ duration: 0.2 }}
                style={{
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
              >
                <FloatingArrow ref={arrowRef} context={context} fill='white' />
                {renderPopover}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
