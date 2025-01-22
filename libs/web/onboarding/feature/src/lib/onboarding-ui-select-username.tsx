import { Avatar, Combobox, Group, InputBase, Text, useCombobox } from '@mantine/core'
import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import React, { useEffect } from 'react'

export function OnboardingUiSelectAvatarUrl({
  avatarUrl,
  setAvatarUrl,
}: {
  avatarUrl: string
  setAvatarUrl: (avatarUrl: string) => void
}) {
  const { avatarUrls } = useUserOnboarding()

  useEffect(() => {
    if (!avatarUrls?.length) {
      return
    }
    if (!avatarUrl.length) {
      setAvatarUrl(avatarUrls[0])
    }
  }, [avatarUrls, avatarUrl])

  return <SelectOptionComponent urls={avatarUrls} url={avatarUrl} setUrl={setAvatarUrl} />
}

function SelectOptionUrl({ url }: { url: string }) {
  if (!url) {
    return null
  }
  return (
    <Group align="center" justify="flex-start" wrap="nowrap" w="100%" py="md">
      <Avatar src={url} size={80} radius={80} mx="auto" />
      <Text>{url?.split('/')[2]}</Text>
    </Group>
  )
}

export function SelectOptionComponent({
  urls,
  url,
  setUrl,
}: {
  urls: string[]
  url: string
  setUrl: (url: string) => void
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const options = urls.map((url) => (
    <Combobox.Option value={url} key={url}>
      <SelectOptionUrl url={url} />
    </Combobox.Option>
  ))

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setUrl(val as string)
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <InputBase
          miw={400}
          label="Select your avatar"
          description="You can always change this later."
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          <SelectOptionUrl url={url} />
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
