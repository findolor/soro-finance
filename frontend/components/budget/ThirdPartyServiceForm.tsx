import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export interface ThirdPartyService {
  id: number;
  name: string;
  monthlyCost: number;
}

interface ThirdPartyServiceFormProps {
  thirdPartyServices: ThirdPartyService[];
  onChange: (services: ThirdPartyService[]) => void;
}

const ThirdPartyServiceForm: FC<ThirdPartyServiceFormProps> = ({
  thirdPartyServices,
  onChange,
}) => {
  // Set up form
  const form = useForm();

  const generateId = () => {
    return thirdPartyServices.length > 0
      ? Math.max(...thirdPartyServices.map((s) => s.id)) + 1
      : 0;
  };

  // Add a new empty service
  const addThirdPartyService = () => {
    const newService: ThirdPartyService = {
      id: generateId(),
      name: "",
      monthlyCost: 0,
    };
    onChange([...thirdPartyServices, newService]);
  };

  // Remove a service by ID
  const removeThirdPartyService = (id: number) => {
    const updatedServices = thirdPartyServices.filter(
      (service) => service.id !== id
    );
    onChange(updatedServices);
  };

  // Update a service's field
  const updateThirdPartyService = (
    id: number,
    field: keyof ThirdPartyService,
    value: string | number
  ) => {
    const updatedServices = thirdPartyServices.map((service) => {
      if (service.id === id) {
        return { ...service, [field]: value };
      }
      return service;
    });
    onChange(updatedServices);
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        {thirdPartyServices.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">
              No third party services added yet
            </p>
            <Button onClick={addThirdPartyService}>
              <Plus className="mr-2 h-4 w-4" />
              Add Third Party Service
            </Button>
          </div>
        ) : (
          <>
            {thirdPartyServices.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-card"
              >
                <FormItem>
                  <FormLabel htmlFor={`name-${service.id}`}>
                    Service Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={`name-${service.id}`}
                      value={service.name}
                      onChange={(e) =>
                        updateThirdPartyService(
                          service.id,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Service name"
                    />
                  </FormControl>
                </FormItem>

                <div>
                  <FormItem>
                    <FormLabel htmlFor={`cost-${service.id}`}>
                      Monthly Cost ($)
                    </FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input
                          id={`cost-${service.id}`}
                          type="number"
                          value={service.monthlyCost || ""}
                          onChange={(e) =>
                            updateThirdPartyService(
                              service.id,
                              "monthlyCost",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="flex-1"
                        />
                      </FormControl>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeThirdPartyService(service.id)}
                        className="ml-2"
                        title="Remove service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormItem>
                </div>
              </div>
            ))}
            <Button
              onClick={addThirdPartyService}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Third Party Service
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};

export default ThirdPartyServiceForm;
