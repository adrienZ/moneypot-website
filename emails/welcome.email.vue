<script setup lang="ts">
const props = defineProps<{
  username?: string;
}>();

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};
</script>

<template>
  <EHtml>
    <EHead />
    <EPreview>Welcome {{ username }}</EPreview>
    <EBody :style="main">
      <EContainer>
        <ESection>
          <EHeading
            as="h2"
            :style="{
              fontSize: '26px',
              fontWeight: 'bold',
              textAlign: 'center'
            }"
          >
            Welcome {{ username }}
          </EHeading>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>
