<script>
    import Card, {
        Content,
    } from '@smui/card';

    export let id;
    export let desc;
    export let inst;
</script>

<bay>
    <div class="card-container">
        <Card>
          <Content>Logical Device #{id}
            <br>
            Description: {desc}
            <br>
            Instance: {inst}</Content>
        </Card>
    </div>
</bay>

<style>
    bay {
      width: 100%;
      height: 100%;
    }
  </style>