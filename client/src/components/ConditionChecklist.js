import React from 'react';

const ConditionChecklist = ({ category, selectedChecks, setSelectedChecks }) => {
  // Define custom criteria for different hobbies
  const criteriaMap = {
    'Cards': ['Centered', 'No Whitening on Edges', 'Sharp Corners', 'Surface Scratch-Free'],
    'Coins': ['Uncirculated', 'No Scratches', 'Original Luster', 'Clear Date/Mint Mark'],
    'Books': ['No Torn Pages', 'Binding Intact', 'No Spine Stress', 'Cover pristine'],
    'Board Games': ['All Pieces Included', 'Box Unscratched', 'Instructions Included', 'No Board Warping'],
    'Plants': ['Pest-free', 'Healthy Roots', 'No Yellow Leaves', 'Actively Growing'],
    'Others': ['Clean', 'Fully Functional', 'No Major Damage']
  };

  const currentCriteria = criteriaMap[category] || criteriaMap['Others'];

  const handleCheckboxChange = (criterion) => {
    if (selectedChecks.includes(criterion)) {
      setSelectedChecks(selectedChecks.filter((item) => item !== criterion));
    } else {
      setSelectedChecks([...selectedChecks, criterion]);
    }
  };

  if (!category) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <h4 className="text-sm font-semibold mb-2">Item Condition Checklist for {category}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {currentCriteria.map((criterion, index) => (
          <label key={index} className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded text-blue-600 focus:ring-blue-500"
              checked={selectedChecks.includes(criterion)}
              onChange={() => handleCheckboxChange(criterion)}
            />
            <span>{criterion}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ConditionChecklist;
