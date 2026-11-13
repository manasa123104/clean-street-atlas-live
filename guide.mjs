export const cards = {
  litter: { title: 'Littered public space', route: 'Community cleanup', steps: ['Choose a public spot and check local cleanup rules.', 'Use gloves and a litter grabber for ordinary litter.', 'Arrange approved bag collection before the event.'] },
  bulky: { title: 'Bulky item on the curb', route: 'Municipal collection', steps: ['Check your municipality’s bulky waste pickup rules.', 'Keep paths clear and leave unfamiliar dumped items alone.', 'Use the official collection or reporting channel.'] },
  overflow: { title: 'Overflowing public bin', route: 'Municipal sanitation', steps: ['Note the public location for your own report.', 'Leave the bin and spilled waste undisturbed.', 'Report it through your municipality’s official sanitation channel.'] },
  hazard: { title: 'Potentially hazardous waste', route: 'Professional response', steps: ['Keep your distance and leave the material undisturbed.', 'Warn others to avoid the immediate area if you can do so safely.', 'Contact your local hazardous-waste authority. Call local emergency services if there is immediate danger.'] },
  unclear: { title: 'More detail needed', route: 'Choose a category', steps: ['Use one of the example prompts or describe the type of waste.', 'Leave out names, addresses and contact details.', 'If you suspect a hazard, keep your distance and use the Hazardous waste option.'] }
};
export function classify(text) {
  if (/needle|syringe|sharp|chemical|asbestos|battery|sewage|blood|unknown liquid|broken glass|oil spill|medical waste|hazard|fire|explosive/i.test(text)) return 'hazard';
  if (/overflow|full bin|full trash|spill.*bin/i.test(text)) return 'overflow';
  if (/mattress|sofa|furniture|appliance|bulky/i.test(text)) return 'bulky';
  if (/litter|wrappers|plastic bottles|cleanup/i.test(text)) return 'litter';
  return 'unclear';
}
