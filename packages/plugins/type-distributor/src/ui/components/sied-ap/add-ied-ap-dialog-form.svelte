<script lang="ts">
  import { createSIED, getSIEDs, createAccessPoints } from "@/headless/ied";
  import { bayStore } from "@/headless/stores";
  import {
    Label,
    Input,
    Button,
    dialogStore,
    SelectWorkaround,
  } from "@oscd-plugins/core-ui-svelte";

  let iedName = $state("");
  let iedDesc = $state("");
  let existingSIedName = $state<string>("");
  let accessPointName = $state("");
  let accessPointDesc = $state("");
  let isCreatingIED = $state(false);
  let iedCreationError = $state<string | null>(null);

  const existingSIeds = $derived.by(() => {
    const sieds = getSIEDs(bayStore.selectedBay ?? "");
    return sieds.map((ied) => ({
      value: ied.getAttribute("name") || "",
      label: ied.getAttribute("name") || "Unnamed IED",
    }));
  });

  const sIedOptions = $derived([
    { value: "", label: "None (Create New)" },
    ...existingSIeds,
  ]);

  const isCreatingNewIed = $derived(!existingSIedName);
  const hasAccessPoint = $derived(accessPointName.trim().length > 0);

  async function handleSubmit() {
    iedCreationError = null;

    // Validation
    if (isCreatingNewIed && !iedName.trim()) {
      iedCreationError = "IED name is required when creating a new IED";
      return;
    }

    if (!isCreatingNewIed && !existingSIedName) {
      iedCreationError = "Please select an existing IED or create a new one";
      return;
    }

    if (!hasAccessPoint && isCreatingNewIed) {
      iedCreationError = "Access Point name is required";
      return;
    }

    try {
      isCreatingIED = true;

      const accessPoint = hasAccessPoint
        ? [
            {
              name: accessPointName.trim(),
              description: accessPointDesc.trim() || undefined,
            },
          ]
        : undefined;

      if (isCreatingNewIed) {
        // Create new IED with access point
        createSIED(iedName.trim(), iedDesc.trim() || undefined, accessPoint);
      } else {
        // Add access point to existing IED
        if (hasAccessPoint && existingSIedName && accessPoint) {
          createAccessPoints(existingSIedName, accessPoint);
        }
      }

      iedName = "";
      iedDesc = "";
      existingSIedName = "";
      accessPointName = "";
      accessPointDesc = "";
      await dialogStore.closeDialog("success");
    } catch (error) {
      iedCreationError =
        error instanceof Error ? error.message : "Failed to create IED";
    } finally {
      isCreatingIED = false;
    }
  }

  async function handleCancel() {
    await dialogStore.closeDialog("cancel");
  }
</script>

<div class="flex flex-col gap-4">
  <section>
    <header class="pb-4">
      <h1 class="text-xl font-bold">Select existing S-IED</h1>
    </header>
    <div class="space-y-2">
      <SelectWorkaround
        bind:value={existingSIedName}
        options={sIedOptions}
        placeholder="Search S-IEDs"
        class="w-full"
      />
    </div>
  </section>

  {#if isCreatingNewIed}
    <section>
      <header class="pb-4">
        <h1 class="text-xl font-bold">Create New IED</h1>
      </header>
      <div class="space-y-3">
        <div class="space-y-2">
          <Label.Root for="ied-name">Name *</Label.Root>
          <Input.Root
            id="ied-name"
            bind:value={iedName}
            placeholder="Enter IED name"
            disabled={isCreatingIED}
          />
        </div>
        <div class="space-y-2">
          <Label.Root for="ied-desc">Description</Label.Root>
          <Input.Root
            id="ied-desc"
            bind:value={iedDesc}
            placeholder="Enter IED description (optional)"
            disabled={isCreatingIED}
          />
        </div>
      </div>
    </section>
  {/if}

  <section>
    <header class="pb-4">
      <h1 class="text-xl font-bold">Add Access Point</h1>
    </header>
    <div class="space-y-3">
      <div class="space-y-2">
        <Label.Root for="ap-name">Name *</Label.Root>
        <Input.Root
          id="ap-name"
          bind:value={accessPointName}
          placeholder="Enter Access Point name"
          disabled={isCreatingIED}
        />
      </div>
      <div class="space-y-2">
        <Label.Root for="ap-desc">Description</Label.Root>
        <Input.Root
          id="ap-desc"
          bind:value={accessPointDesc}
          placeholder="Enter Access Point description (optional)"
          disabled={isCreatingIED}
        />
      </div>
    </div>
  </section>

  {#if iedCreationError}
    <p class="text-sm text-red-600">{iedCreationError}</p>
  {/if}

  <section>
    <footer class="flex justify-end space-x-2 mt-4">
      <Button.Root
        variant="outline"
        onclick={handleCancel}
        disabled={isCreatingIED}
      >
        Cancel
      </Button.Root>
      <Button.Root
        onclick={handleSubmit}
        disabled={isCreatingIED || (!isCreatingNewIed && !hasAccessPoint)}
      >
        {isCreatingIED
          ? "Creating..."
          : isCreatingNewIed
            ? "Create IED & Access Point"
            : "Add Access Point"}
      </Button.Root>
    </footer>
  </section>
</div>
