import { getUserMotorcycles } from '@/app/actions/motorcycles';
import GarageView from '@/components/garage/GarageView';

/**
 * Garage page - SSR fetches user's motorcycles and passes them to the interactive client view.
 */
export default async function GaragePage() {
  const motorcycles = await getUserMotorcycles();

  return <GarageView initialMotorcycles={motorcycles} />;
}
