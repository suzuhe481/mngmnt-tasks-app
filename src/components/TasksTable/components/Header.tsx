export const Header = () => {
  /*
  Mandatory Columns
  -Select all checkbox
  -Space for edit icon
  -Space for delete icon
  -Title
  -Status
  -Priority

  Additional columns created for custom fields.
  */
  return (
    <thead className="bg-blue-200">
      <tr>
        <th className="p-2 border-2 border-slate-300 w-2">
          <div className="flex flex-col justify-center items-center">
            <input type="checkbox" id="select-all" className="w-6 h-6" />
          </div>
        </th>
        <th className="p-2 border-2 border-slate-300"></th>
        <th className="p-2 border-2 border-slate-300"></th>
        <th className="p-2 border-2 border-slate-300 min-w-3xs text-left text-slate-700">
          Title
        </th>
        <th className="p-2 border-2 border-slate-300 min-w-48 text-left text-slate-700">
          Status
        </th>
        <th className="p-2 border-2 border-slate-300 min-w-36 text-left text-slate-700">
          Priority
        </th>
      </tr>
    </thead>
  );
};
