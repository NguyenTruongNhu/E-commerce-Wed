import React, { memo } from 'react'
import clsx from 'clsx'
const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  fullwidth,
  defaultValue
}) => {
  return (
    <div className={clsx('flex flex-col gap-2', style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        defaultValue={defaultValue}
        className={clsx(
          'form-select max-h-[42px]',
          fullwidth && 'w-full',
          style
        )}
        id={id}
        {...register(id, validate)}
      >
        <option value="">---CHOOSE---</option>
        {options?.map((el, index) => (
          <option key={index} value={el.code}>
            {el.value}
          </option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500 italic">
          {errors[id]?.message}
        </small>
      )}
    </div>
  )
}

export default memo(Select)
