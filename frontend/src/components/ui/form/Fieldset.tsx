interface FieldsetProps {
  title?: string;
  children: React.ReactNode;
}

const Fieldset = ({ title, children }: FieldsetProps) => {
  return (
    <fieldset className="space-y-4 pt-4 border-t border-slate-200">
      {title && <legend className="text-sm font-semibold text-slate-500 mb-2">{title}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;